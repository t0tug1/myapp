const express = require('express');
const app = express();
const path = require('path');

// view engine の設定
app.set('view engine', 'ejs');

// 静的ファイル配信設定
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'public')));

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
app.listen(3000, () => {
    console.log(`http://localhost:3000`);
});
