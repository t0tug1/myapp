import { loadDashboardContent } from './dashboard.js';
import { loadGoodSignContent } from './good-sign.js';
import { loadWarningSignContent } from './warning-sign.js';
import { loadDangerSignContent } from './danger-sign.js';
import { loadLifestyleHabitsContent } from './lifestyle-habits.js';

document.addEventListener('DOMContentLoaded', () => {

    // トリガーとなるボタンを取得
    const dashboardButton = document.getElementById('dashboardPage');
    const goodSignButton = document.getElementById('goodSignPage');
    const warningSignButton = document.getElementById('warningSignPage');
    const dangerSignButton = document.getElementById('dangerSignPage');
    const lifestyleHabitsButton = document.getElementById('lifestyleHabitsPage');

    // HTMLを挿入するコンテナを取得
    const contentContainer = document.getElementById('main-header-area');

    // 各種ページ生成関数呼び出し

    //初回リロードページ
    loadDashboardContent(contentContainer); // ダッシュボードを作成

    // ボタンにクリックイベントを設定

    //dashboardPage ボタン
    dashboardButton.addEventListener('click', () => {
        // ダッシュボードのHTMLを生成・挿入する関数を呼び出す
        loadDashboardContent(contentContainer); // ダッシュボードを作成
    });

    // goodSignPage ボタン
    goodSignButton.addEventListener('click', () => {
        // 良好サインページのHTMLを生成・挿入する関数を呼び出す
        loadGoodSignContent(contentContainer);
    });

    // warningSignPage ボタン
    warningSignButton.addEventListener('click', () => {
        // 警告サインページのHTMLを生成・挿入する関数を呼び出す
        loadWarningSignContent(contentContainer);
    });

    // dangerSignPage ボタン
    dangerSignButton.addEventListener('click', () => {
        // 危険サインページのHTMLを生成・挿入する関数を呼び出す
        loadDangerSignContent(contentContainer);
    });

    // lifestyleHabitsPage ボタン
    lifestyleHabitsButton.addEventListener('click', () => {
        // 生活習慣ページのHTMLを生成・挿入する関数を呼び出す
        loadLifestyleHabitsContent(contentContainer);
    });
});
