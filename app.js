const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const basicAuth = require('express-basic-auth');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
const Redis = require('ioredis');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

// --- 設定・定数 ---
const saltRounds = 10;

// 本番環境では必ず環境変数から読み込んでください
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret_key_change_me';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_key_change_me';
const ACCESS_TOKEN_EXPIRY = '15m';  // アクセストークン有効期限
const REFRESH_TOKEN_EXPIRY = '7d';  // リフレッシュトークン有効期限
const REFRESH_TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // Redis用 (秒)
const BASIC_AUTH_USER = 'admin';
const BASIC_AUTH_PASS = 'supersecret5670';

// Redis クライアント初期化
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
});

// DB プール初期化
const pool = new Pool();

// --- ミドルウェア設定 ---
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie解析用
// cookie-parser ミドルウェアの使用
// これにより req.cookies オブジェクトが自動的に生成されます
app.use(cookieParser());

// --- JWT ヘルパー関数 ---

// アクセストークン生成
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.user_id, username: user.user_name },
        JWT_ACCESS_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
};

// リフレッシュトークン生成とRedisへの保存 (RTR対応)
const generateAndStoreRefreshToken = async (user, familyId = null) => {
    // 新しいFamily IDの発行（なければ）
    const fid = familyId || crypto.randomUUID();
    // トークンごとのユニークID (JTI)
    const jti = crypto.randomUUID();

    const refreshToken = jwt.sign(
        { userId: user.user_id, jti, fid },
        JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Redisに保存
    // Key: rt:{jti} -> Value: { userId, familyId, isUsed }
    const key = `rt:${jti}`;
    const value = JSON.stringify({
        userId: user.user_id,
        familyId: fid,
        isUsed: false
    });
    
    await redis.set(key, value, 'EX', REFRESH_TOKEN_EXPIRY_SECONDS);

    return refreshToken;
};

// 1. Basic認証ミドルウェアの設定
app.use(basicAuth({
    // ユーザー名とパスワードのマップ
    users: { [BASIC_AUTH_USER]: BASIC_AUTH_PASS },

    // これを設定することで、ブラウザに認証ダイアログを表示させます。
    challenge: true,

    // 認証失敗時に表示するメッセージ（オプション）
    unauthorizedResponse: '認証情報が正しくありません。'
}));

// --- ルート設定 ---

// 1. ダッシュボード (保護されたページ)
// SSRのため、Cookieにリフレッシュトークンがあるか簡易チェックして表示
// 本格的なデータ取得はクライアントサイドでアクセストークンを用いて行う想定
app.get('/', async (req, res) => {
    // cookie-parserにより req.cookies['refreshToken'] でアクセス可能
    const refreshToken = req.cookies['refreshToken'];
    
    if (!refreshToken) {
        return res.redirect('/login');
    }

    // ここで厳密に検証するか、画面表示だけ許可してAPIで弾くかはポリシー次第
    // 今回は画面を表示させる
    res.render('dashboard');
});

// 2. ログインページ
app.get('/login', (req, res) => {
    res.render('login');
});

// 3. ログイン処理 (API)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    let client;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM users WHERE user_name = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 認証成功: トークン生成
        const accessToken = generateAccessToken(user);
        const refreshToken = await generateAndStoreRefreshToken(user); // 新規FamilyID

        // リフレッシュトークンをHttpOnly Cookieに設定
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS環境ならtrue
            sameSite: 'Strict',
            maxAge: REFRESH_TOKEN_EXPIRY_SECONDS * 1000
        });

        // アクセストークンはJSONボディで返す（メモリ保存用）
        res.json({ accessToken, message: 'Login successful' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (client) client.release();
    }
});

// 4. トークンリフレッシュ処理 (RTRの中核)
app.post('/refresh-token', async (req, res) => {
    const incomingRefreshToken = req.cookies['refreshToken'];

    if (!incomingRefreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        // 1. JWT署名検証
        const decoded = jwt.verify(incomingRefreshToken, JWT_REFRESH_SECRET);
        const { jti, fid, userId } = decoded;

        // 2. Redisからトークン情報を取得
        const key = `rt:${jti}`;
        const tokenDataString = await redis.get(key);

        // トークンがRedisにない（期限切れ等）
        if (!tokenDataString) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const tokenData = JSON.parse(tokenDataString);

        // 3. Family IDがブロックリストに入っていないか確認 (Replay Attack対策)
        const blocklistKey = `blocklist:${fid}`;
        const isBlocked = await redis.get(blocklistKey);

        if (isBlocked) {
            // 危険: このファミリーは侵害されている
            await redis.del(key); // 現在のトークンも削除
            res.clearCookie('refreshToken');
            return res.status(403).json({ message: 'Security alert: Replay attack detected. Please login again.' });
        }

        // 4. 使用済みトークンの再利用チェック (RTR)
        if (tokenData.isUsed) {
            // **侵害検知 (Replay Attack)**
            // 既に使われたトークンが再度送られてきた -> トークン奪取の可能性
            // このFamily IDをブロックリストに追加し、全ての関連トークンを無効化する
            await redis.set(blocklistKey, '1', 'EX', REFRESH_TOKEN_EXPIRY_SECONDS);
            
            res.clearCookie('refreshToken');
            return res.status(403).json({ message: 'Security alert: Replay attack detected. All sessions revoked.' });
        }

        // 5. 正常なローテーション処理
        // 現在のトークンを「使用済み」にする
        tokenData.isUsed = true;
        // RedisのTTLを維持しつつ更新 (KEEPTTLオプションはRedis 6.0+)
        // 簡易的に残り時間を計算してセット、または十分な時間を再設定
        await redis.set(key, JSON.stringify(tokenData), 'EX', REFRESH_TOKEN_EXPIRY_SECONDS);

        // 新しいトークンペアの発行 (同じFamily IDを引き継ぐ)
        const user = { id: userId, user_name: 'fetched_from_db_if_needed' }; // 必要ならDB再取得
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = await generateAndStoreRefreshToken(user, fid);

        // Cookie更新
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: REFRESH_TOKEN_EXPIRY_SECONDS * 1000
        });

        // 新しいアクセストークンを返す
        res.json({ accessToken: newAccessToken });

    } catch (err) {
        console.error('Refresh error:', err);
        res.clearCookie('refreshToken');
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
});

// 5. ログアウト
app.post('/logout', (req, res) => {
    // アクセストークンはクライアント側で破棄
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
});

//サインアップページ
app.get('/signup', (req, res) => {
    res.render('signup');
});

//サインアップ処理
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // ユーザー名とパスワードが入力されているか
    if (!username || !password) {
        console.log('Signup Failure: Username or password missing.');
        // 入力されていなかったら /signup にリダイレクト
        return res.redirect('/signup');
    }

    // ユーザー名が50文字以内か (50文字より大きい場合はNG)
    if (username.length > 50) {
        console.log('Signup Failure: Username exceeds 50 characters.');
        // 50文字以内ではなかったら /signup にリダイレクト
        return res.redirect('/signup');
    }

    // パスワードの文字種チェック (半角英数字のみ)
    // 正規表現: /^[a-zA-Z0-9]+$/
    // ^ ... 文字列の先頭
    // [a-zA-Z0-9] ... a～z, A～Z, 0～9 のいずれか
    // + ... 1文字以上
    // $ ... 文字列の末尾
    const passwordRegex = /^[a-zA-Z0-9]+$/;

    if (!passwordRegex.test(password)) {
        console.log('Signup Failure: Password contains non-alphanumeric characters.');
        // 半角英数字以外が入力されたら /signup にリダイレクト
        return res.redirect('/signup');
    }

    let client;
    try {
        // パスワードをハッシュ化
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // データベースに保存
        client = await pool.connect();
        
        // 'password_hash' カラムにハッシュ化されたパスワードを保存
        const queryText = 'INSERT INTO users (user_name, password_hash) VALUES ($1, $2) RETURNING user_id';
        const result = await client.query(queryText, [username, hashedPassword]);

        console.log(`Success: User '${username}' created with id ${result.rows[0].id}.`);

        // TODO: ここでセッションを開始し、ログイン状態にする
        
        // /dashboard にリダイレクト
        res.redirect('/');

    } catch (err) {
        // データベースエラー処理
        // (エラーコード '23505' は UNIQUE 制約違反 = ユーザー名重複)
        if (err.code === '23505') {
            console.log(`Signup Failure: Username '${username}' already exists.`);
        } else {
            console.error('Signup error:', err.stack);
        }
        // エラーが発生した場合は /signup に戻す
        res.redirect('/signup');
    } finally {
        if (client) {
            // 使用したクライアントをプールに返却
            client.release();
        }
    }
});

//アカウントセッティングページ
app.get('/account_setting', (req, res) => {
    res.render('account_setting');
});

//セルフケアページ
app.get('/selfcare', (req, res) => {
    res.render('selfcare');
});

//項目編集ページ
app.get('/edit', (req, res) => {
    res.render('edit');
});

//yarn dev
app.listen(3000, () => {
    console.log(`http://localhost:3000`);
});
