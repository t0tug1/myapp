const express = require('express');
const app = express();
const basicAuth = require('express-basic-auth');
const path = require('path');

// view engine の設定
app.set('view engine', 'ejs');

// 静的ファイル配信設定
app.use(express.static(path.join(__dirname, 'public')));

// --- 環境変数から認証情報を取得 ---
const ADMIN_USER = process.env.BASIC_AUTH_USER || 'admin';
const ADMIN_PASS = process.env.BASIC_AUTH_PASS || 'secret';
// ------------------------------------

// 1. Basic認証ミドルウェアの設定
app.use(basicAuth({
    // ユーザー名とパスワードのマップ
    users: { [ADMIN_USER]: ADMIN_PASS },

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
    res.render('login');
});

//サインアップページ
app.get('/signup', (req, res) => {
    res.render('signup');
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
