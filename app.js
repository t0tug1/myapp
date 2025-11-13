const express = require('express');
const app = express();
const path = require('path');
const basicAuth = require('express-basic-auth');

// view engine の設定
app.set('view engine', 'ejs');

// 静的ファイル配信設定
app.use(express.static(path.join(__dirname, 'public')));

// --- 環境変数から認証情報を取得 ---
const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER;
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS;
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
    res.render('login');
});

//サインアップページ
app.get('/signup', (req, res) => {
    res.render('signup');
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
