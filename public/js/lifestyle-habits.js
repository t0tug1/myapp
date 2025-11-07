/**
 * ページのHTMLをコンテナに挿入し、イベントを設定する関数
 * @param {HTMLElement} container - HTMLを挿入する先のコンテナ要素
 */

//グラフファイル読み込み
export function loadLifestyleHabitsGraphsContents(){
    const scriptElement = document.createElement('script');

    scriptElement.src = './lifestyle-habits-graphs.js';

    document.body.appendChild(scriptElement);
}

// 生活習慣ページを生成する関数
export function loadLifestyleHabitsContent(container) {
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
