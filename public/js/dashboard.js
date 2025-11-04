/**
 * ページの読み込みが完了したら実行
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. トリガーとなるボタンを取得
    const dashboardButton = document.getElementById('dashboardPage');
    const goodSignButton = document.getElementById('goodSignPage');
    const warningSignButton = document.getElementById('warningSignPage');
    const dangerSignButton = document.getElementById('dangerSignPage');
    const lifestyleHabitsButton = document.getElementById('lifestyleHabitsPage');

    // 2. HTMLを挿入するコンテナを取得
    const contentContainer = document.getElementById('main-content-area');

    // 各種ページ生成関数呼び出し
    // 3. ボタンにクリックイベントを設定
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


/**
 * 良好サインのHTMLをコンテナに挿入し、イベントを設定する関数
 * @param {HTMLElement} container - HTMLを挿入する先のコンテナ要素
 */

// ダッシュボードの関数
function loadDashboardContent(container) {

    // 1. 挿入するHTMLコンテンツ
    container.innerHTML = `
            <div class="row align-items-center border-bottom pb-2 mb-3">

                <div class="col-12 col-lg-3">
                    <h2 class="fs-3 fw-bold text-center text-md-start mb-2 mb-md-0" id="graphTitle">折れ線グラフ</h2>
                </div>

                <div class="col-12 col-lg-7 d-flex justify-content-center justify-content-md-end my-2 my-md-0">
                    <ul class="nav nav-pills" id="evaluationTabs" role="tablist">
                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link active" id="five-step-tab" data-bs-toggle="pill"
                                data-bs-target="#five-step-content" type="button" role="tab"
                                aria-controls="five-step-content" aria-selected="true"
                                data-graph-title="折れ線グラフ">
                                5段階評価
                            </button>
                        </li>

                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link" id="three-step-tab" data-bs-toggle="pill"
                                data-bs-target="#three-step-content" type="button" role="tab"
                                aria-controls="three-step-content" aria-selected="false" data-graph-title="表">
                                3段階評価
                            </button>
                        </li>

                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link" id="numeric-tab" data-bs-toggle="pill"
                                data-bs-target="#numeric-content" type="button" role="tab"
                                aria-controls="numeric-content" aria-selected="false" data-graph-title="棒グラフ">
                                数値評価
                            </button>
                        </li>
                    </ul>
                </div>

                <div class="col-12 col-lg-2 d-flex justify-content-end">
                    <div class="btn-group" role="group" aria-label="期間の切り替え">

                        <input type="radio" class="btn-check" name="period-options" id="period-week-radio"
                            autocomplete="off" checked>
                        <label class="btn btn-outline-secondary" for="period-week-radio">
                            1週間
                        </label>

                        <input type="radio" class="btn-check" name="period-options" id="period-month-radio"
                            autocomplete="off">
                        <label class="btn btn-outline-secondary" for="period-month-radio">
                            1ヶ月間
                        </label>
                    </div>
                </div>
            </div>

            <div class="tab-content">
                <div class="tab-pane fade show active" id="five-step-content" role="tabpanel">
                    <p>5段階評価の折れ線グラフが表示されます。</p>
                </div>
                <div class="tab-pane fade" id="three-step-content" role="tabpanel">
                    <p>3段階評価(○△✕)の表が表示されます。</p>
                </div>
                <div class="tab-pane fade" id="numeric-content" role="tabpanel">
                    <p>数値評価の棒グラフが表示されます。</p>
                </div>
            </div>
    `;

    // 2. コンテナの中身を丸ごと書き換える
    container.innerHTML = dashboardHTML;


    // 3. 【重要】HTML挿入後に、Bootstrapタブのイベントリスナーをセットアップ
    // (Bootstrap 5 の `bootstrap.Tab` がロードされている必要があります)
    setupDynamicBootstrapTabs(container);
}

// 良好サインページの関数
function loadGoodSignContent(container) {

    // 1. 挿入するHTMLコンテンツ
    container.innerHTML = `
            <div class="row align-items-center border-bottom pb-2 mb-3">

                <div class="col-12 col-lg-3">
                    <h2 class="fs-3 fw-bold text-center text-md-start mb-2 mb-md-0" id="graphTitle">折れ線グラフ</h2>
                </div>

                <div class="col-12 col-lg-7 d-flex justify-content-center justify-content-md-end my-2 my-md-0">
                    <ul class="nav nav-pills" id="evaluationTabs" role="tablist">
                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link active" id="five-step-tab" data-bs-toggle="pill"
                                data-bs-target="#five-step-content" type="button" role="tab"
                                aria-controls="five-step-content" aria-selected="true"
                                data-graph-title="折れ線グラフ">
                                5段階評価
                            </button>
                        </li>

                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link" id="three-step-tab" data-bs-toggle="pill"
                                data-bs-target="#three-step-content" type="button" role="tab"
                                aria-controls="three-step-content" aria-selected="false" data-graph-title="表">
                                3段階評価
                            </button>
                        </li>

                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link" id="numeric-tab" data-bs-toggle="pill"
                                data-bs-target="#numeric-content" type="button" role="tab"
                                aria-controls="numeric-content" aria-selected="false" data-graph-title="棒グラフ">
                                数値評価
                            </button>
                        </li>
                    </ul>
                </div>

                <div class="col-12 col-lg-2 d-flex justify-content-end">
                    <div class="btn-group" role="group" aria-label="期間の切り替え">

                        <input type="radio" class="btn-check" name="period-options" id="period-week-radio"
                            autocomplete="off" checked>
                        <label class="btn btn-outline-secondary" for="period-week-radio">
                            1週間
                        </label>

                        <input type="radio" class="btn-check" name="period-options" id="period-month-radio"
                            autocomplete="off">
                        <label class="btn btn-outline-secondary" for="period-month-radio">
                            1ヶ月間
                        </label>
                    </div>
                </div>
            </div>

            <div class="tab-content">
                <div class="tab-pane fade show active" id="five-step-content" role="tabpanel">
                    <p>5段階評価の折れ線グラフが表示されます。</p>
                    <p>ここは良好サインページの内容です。</p>
                </div>
                <div class="tab-pane fade" id="three-step-content" role="tabpanel">
                    <p>3段階評価(○△✕)の表が表示されます。</p>
                </div>
                <div class="tab-pane fade" id="numeric-content" role="tabpanel">
                    <p>数値評価の棒グラフが表示されます。</p>
                </div>
            </div>
    `;

    // 3. 【重要】HTML挿入後に、Bootstrapタブのイベントリスナーをセットアップ
    // (Bootstrap 5 の `bootstrap.Tab` がロードされている必要があります)
    setupDynamicBootstrapTabs(container);
}

// 警告サインページの関数
function loadWarningSignContent(container) {
    // 警告サインページのHTMLをここに実装
    container.innerHTML = `
            <div class="row align-items-center border-bottom pb-2 mb-3">

                <div class="col-12 col-lg-3">
                    <h2 class="fs-3 fw-bold text-center text-md-start mb-2 mb-md-0" id="graphTitle">折れ線グラフ</h2>
                </div>

                <div class="col-12 col-lg-7 d-flex justify-content-center justify-content-md-end my-2 my-md-0">
                    <ul class="nav nav-pills" id="evaluationTabs" role="tablist">
                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link active" id="five-step-tab" data-bs-toggle="pill"
                                data-bs-target="#five-step-content" type="button" role="tab"
                                aria-controls="five-step-content" aria-selected="true"
                                data-graph-title="折れ線グラフ">
                                5段階評価
                            </button>
                        </li>

                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link" id="three-step-tab" data-bs-toggle="pill"
                                data-bs-target="#three-step-content" type="button" role="tab"
                                aria-controls="three-step-content" aria-selected="false" data-graph-title="表">
                                3段階評価
                            </button>
                        </li>

                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link" id="numeric-tab" data-bs-toggle="pill"
                                data-bs-target="#numeric-content" type="button" role="tab"
                                aria-controls="numeric-content" aria-selected="false" data-graph-title="棒グラフ">
                                数値評価
                            </button>
                        </li>
                    </ul>
                </div>

                <div class="col-12 col-lg-2 d-flex justify-content-end">
                    <div class="btn-group" role="group" aria-label="期間の切り替え">

                        <input type="radio" class="btn-check" name="period-options" id="period-week-radio"
                            autocomplete="off" checked>
                        <label class="btn btn-outline-secondary" for="period-week-radio">
                            1週間
                        </label>

                        <input type="radio" class="btn-check" name="period-options" id="period-month-radio"
                            autocomplete="off">
                        <label class="btn btn-outline-secondary" for="period-month-radio">
                            1ヶ月間
                        </label>
                    </div>
                </div>
            </div>

            <div class="tab-content">
                <div class="tab-pane fade show active" id="five-step-content" role="tabpanel">
                    <p>5段階評価の折れ線グラフが表示されます。</p>
                    <p>ここは警告サインページの内容です。</p>
                </div>
                <div class="tab-pane fade" id="three-step-content" role="tabpanel">
                    <p>3段階評価(○△✕)の表が表示されます。</p>
                </div>
                <div class="tab-pane fade" id="numeric-content" role="tabpanel">
                    <p>数値評価の棒グラフが表示されます。</p>
                </div>
            </div>
    `;

    // 3. 【重要】HTML挿入後に、Bootstrapタブのイベントリスナーをセットアップ
    // (Bootstrap 5 の `bootstrap.Tab` がロードされている必要があります)
    setupDynamicBootstrapTabs(container);
}

// 危険サインページの関数
function loadDangerSignContent(container) {
    // 危険サインページのHTMLをここに実装
    container.innerHTML = `<div class="row align-items-center border-bottom pb-2 mb-3">

                <div class="col-12 col-lg-3">
                    <h2 class="fs-3 fw-bold text-center text-md-start mb-2 mb-md-0" id="graphTitle">折れ線グラフ</h2>
                </div>

                <div class="col-12 col-lg-7 d-flex justify-content-center justify-content-md-end my-2 my-md-0">
                    <ul class="nav nav-pills" id="evaluationTabs" role="tablist">
                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link active" id="five-step-tab" data-bs-toggle="pill"
                                data-bs-target="#five-step-content" type="button" role="tab"
                                aria-controls="five-step-content" aria-selected="true"
                                data-graph-title="折れ線グラフ">
                                5段階評価
                            </button>
                        </li>

                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link" id="three-step-tab" data-bs-toggle="pill"
                                data-bs-target="#three-step-content" type="button" role="tab"
                                aria-controls="three-step-content" aria-selected="false" data-graph-title="表">
                                3段階評価
                            </button>
                        </li>

                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link" id="numeric-tab" data-bs-toggle="pill"
                                data-bs-target="#numeric-content" type="button" role="tab"
                                aria-controls="numeric-content" aria-selected="false" data-graph-title="棒グラフ">
                                数値評価
                            </button>
                        </li>
                    </ul>
                </div>

                <div class="col-12 col-lg-2 d-flex justify-content-end">
                    <div class="btn-group" role="group" aria-label="期間の切り替え">

                        <input type="radio" class="btn-check" name="period-options" id="period-week-radio"
                            autocomplete="off" checked>
                        <label class="btn btn-outline-secondary" for="period-week-radio">
                            1週間
                        </label>

                        <input type="radio" class="btn-check" name="period-options" id="period-month-radio"
                            autocomplete="off">
                        <label class="btn btn-outline-secondary" for="period-month-radio">
                            1ヶ月間
                        </label>
                    </div>
                </div>
            </div>

            <div class="tab-content">
                <div class="tab-pane fade show active" id="five-step-content" role="tabpanel">
                    <p>5段階評価の折れ線グラフが表示されます。</p>
                    <p>ここは悪化サインページの内容です。</p>
                </div>
                <div class="tab-pane fade" id="three-step-content" role="tabpanel">
                    <p>3段階評価(○△✕)の表が表示されます。</p>
                </div>
                <div class="tab-pane fade" id="numeric-content" role="tabpanel">
                    <p>数値評価の棒グラフが表示されます。</p>
                </div>
            </div>`;
    // 3. 【重要】HTML挿入後に、Bootstrapタブのイベントリスナーをセットアップ
    // (Bootstrap 5 の `bootstrap.Tab` がロードされている必要があります)
    setupDynamicBootstrapTabs(container);
}

// 生活習慣ページの関数
function loadLifestyleHabitsContent(container) {
    // 生活習慣ページのHTMLをここに実装
    container.innerHTML = `<div class="row align-items-center border-bottom pb-2 mb-3">

                <div class="col-12 col-lg-3">
                    <h2 class="fs-3 fw-bold text-center text-md-start mb-2 mb-md-0" id="graphTitle">折れ線グラフ</h2>
                </div>

                <div class="col-12 col-lg-7 d-flex justify-content-center justify-content-md-end my-2 my-md-0">
                    <ul class="nav nav-pills" id="evaluationTabs" role="tablist">
                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link active" id="five-step-tab" data-bs-toggle="pill"
                                data-bs-target="#five-step-content" type="button" role="tab"
                                aria-controls="five-step-content" aria-selected="true"
                                data-graph-title="折れ線グラフ">
                                5段階評価
                            </button>
                        </li>

                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link" id="three-step-tab" data-bs-toggle="pill"
                                data-bs-target="#three-step-content" type="button" role="tab"
                                aria-controls="three-step-content" aria-selected="false" data-graph-title="表">
                                3段階評価
                            </button>
                        </li>

                        <li class="nav-item flex-grow-0" role="presentation">
                            <button class="nav-link" id="numeric-tab" data-bs-toggle="pill"
                                data-bs-target="#numeric-content" type="button" role="tab"
                                aria-controls="numeric-content" aria-selected="false" data-graph-title="棒グラフ">
                                数値評価
                            </button>
                        </li>
                    </ul>
                </div>

                <div class="col-12 col-lg-2 d-flex justify-content-end">
                    <div class="btn-group" role="group" aria-label="期間の切り替え">

                        <input type="radio" class="btn-check" name="period-options" id="period-week-radio"
                            autocomplete="off" checked>
                        <label class="btn btn-outline-secondary" for="period-week-radio">
                            1週間
                        </label>

                        <input type="radio" class="btn-check" name="period-options" id="period-month-radio"
                            autocomplete="off">
                        <label class="btn btn-outline-secondary" for="period-month-radio">
                            1ヶ月間
                        </label>
                    </div>
                </div>
            </div>

            <div class="tab-content">
                <div class="tab-pane fade show active" id="five-step-content" role="tabpanel">
                    <p>5段階評価の折れ線グラフが表示されます。</p>
                    <p>ここは生活習慣ページの内容です。</p>
                </div>
                <div class="tab-pane fade" id="three-step-content" role="tabpanel">
                    <p>3段階評価(○△✕)の表が表示されます。</p>
                </div>
                <div class="tab-pane fade" id="numeric-content" role="tabpanel">
                    <p>数値評価の棒グラフが表示されます。</p>
                </div>
            </div>`;
    // 3. 【重要】HTML挿入後に、Bootstrapタブのイベントリスナーをセットアップ
    // (Bootstrap 5 の `bootstrap.Tab` がロードされている必要があります)
    setupDynamicBootstrapTabs(container);
}


/**
 * 動的に挿入されたHTML内のBootstrapタブ機能を有効にし、
 * タイトル書き換えイベントを設定する関数
 * @param {HTMLElement} container - HTMLが挿入された親コンテナ
 */
function setupDynamicBootstrapTabs(container) {
    // 挿入されたHTML内のタイトル要素とタブボタンを取得
    const graphTitle = container.querySelector('#graphTitle');
    const tabButtons = container.querySelectorAll('#evaluationTabs button[data-bs-toggle="pill"]');

    if (!graphTitle) {
        console.error('#graphTitle が見つかりません。');
        return;
    }

    tabButtons.forEach(tabButton => {
        // Bootstrap 5 の Tab インスタンスを手動で取得または作成
        // (これにより、innerHTML で挿入後も Bootstrap が要素を認識します)
        const tabInstance = bootstrap.Tab.getOrCreateInstance(tabButton);

        // 'shown.bs.tab' (タブが表示された後) イベントをリッスン
        tabButton.addEventListener('shown.bs.tab', event => {
            // event.target はクリックされたタブボタン（<button>）
            const newTitle = event.target.getAttribute('data-graph-title');

            if (newTitle) {
                // H2 (graphTitle) のテキストを更新
                graphTitle.textContent = newTitle;
            }
        });
    });
}
