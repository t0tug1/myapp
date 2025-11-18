const express = require('express');
const app = express();
const path = require('path');
const basicAuth = require('express-basic-auth');
const bcrypt = require('bcrypt'); // bcrypt
const { Pool } = require('pg'); // node-postgres

// view engine の設定
app.set('view engine', 'ejs');

// 静的ファイル配信設定
app.use(express.static(path.join(__dirname, 'public')));

// フォームデータを解析するためのミドルウェア
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//poolインスタンス作成
const pool = new Pool();

// Bcryptのソルトラウンド（ハッシュ化の計算コスト）
const saltRounds = 10;

// --- 環境変数から認証情報を取得 ---
const BASIC_AUTH_USER = 'admin';
const BASIC_AUTH_PASS = 'supersecret5670';
// ------------------------------------

// 1. Basic認証ミドルウェアの設定
app.use(basicAuth({
    // ユーザー名とパスワードのマップ
    users: { [BASIC_AUTH_USER]: BASIC_AUTH_PASS },

    // これを設定することで、ブラウザに認証ダイアログを表示させます。
    challenge: true,

    // 認証失敗時に表示するメッセージ（オプション）
    unauthorizedResponse: '認証情報が正しくありません。'
}));

//ルートurl ダッシュボードページ
app.get('/', (req, res) => {
    res.render('dashboard');
});

//ログインページ
app.get('/login', (req, res) => {
    console.log("ログインページ")
    res.render('login');
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
