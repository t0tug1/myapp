const express = require('express');
const app = express();
const path = require('path');

// view engine の設定
app.set('view engine', 'ejs');

// 静的ファイル配信設定
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home');
});

//yarn dev
app.listen(3000, () => {
    console.log(`http://localhost:3000`);
});
