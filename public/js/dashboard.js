/**
 * ページのHTMLをコンテナに挿入し、イベントを設定する関数
 * @param {HTMLElement} container - HTMLを挿入する先のコンテナ要素
 */

// ダッシュボードを生成する関数
export function loadDashboardContent(container) {

    // 挿入するHTMLコンテンツ
    container.innerHTML = `
                <div class="col-12 col-lg-10">
                    <h2 class="fs-3 fw-bold text-center text-md-start mb-2 mb-md-0" id="graphTitle">折れ線グラフ</h2>
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
    `;

    // 現在アクティブなコンテンツをすべて非表示にする
    const allTabPanes = document.querySelectorAll('.tab-content .tab-pane');
    allTabPanes.forEach(pane => {
        pane.classList.remove('active', 'show'); // .active と .show を削除
    });

    // デフォルトのコンテンツ (comprehensive-content) を強制的に表示する
    const defaultPane = document.getElementById('comprehensive-content');
    if (defaultPane) {
        defaultPane.classList.add('active', 'show'); // .active と .show を追加
    }

    // HTML挿入後に、Bootstrapタブのイベントリスナーをセットアップ
    setupDynamicBootstrapTabs(container);

    //グラフ・表 生成関数呼び出し
    drawComprehensiveGraphs();
}

// 折れ線グラフを描画する関数
function drawComprehensiveGraphs() {
    const comprehensiveGraph = document.getElementById("comprehensive-graph");
    const createCanvas = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 200;
        comprehensiveGraph.appendChild(canvas);
        return canvas;
    };

    // グラフが複数回描画されないように、既存のグラフをクリアする
    comprehensiveGraph.innerHTML = '';

    const salesData = [60, 70, 50, 60, 30, 50, 70];
    const labels = ['月', '火', '水', '木', '金', '土', '日'];

    // --- ここからChart.jsのロジック ---

    // 1. 平均値の計算
    const totalSales = salesData.reduce((sum, value) => sum + value, 0);
    const averageSales = totalSales / salesData.length;
    
    // 2. 平均値をグラフの項目数分繰り返す配列を作成
    const averageLineData = new Array(salesData.length).fill(averageSales);

    // 3. キャンバスを動的に作成
    const myCanvas = createCanvas();
    const ctx = myCanvas.getContext('2d');

    // 4. グラフの描画
    const mixedChart = new Chart(ctx, {
        type: 'bar', // ベースとなるグラフタイプ
        data: {
            labels: labels,
            datasets: [
                {
                    // データセット 1: 棒グラフ (結果)
                    label: '総合評価（％）',
                    data: salesData,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)', // 青色
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    order: 2 // 描画順序 (平均線より手前に描画)
                },
                {
                    // データセット 2: 折れ線グラフ (平均線)
                    label: `平均値: ${averageSales.toFixed(1)} ％`,
                    data: averageLineData,
                    type: 'line', // このデータセットのみタイプを 'line' に指定
                    fill: false,
                    borderColor: 'rgb(255, 99, 132)', // 赤色
                    borderWidth: 3,
                    pointRadius: 0, // ポイントを非表示にする
                    tension: 0, // 直線にする
                    order: 1 // 描画順序 (棒グラフより奥に描画)
                }
            ]
        },
        options: {
            // createCanvasで固定サイズ(400x200)を指定したため、
            // Chart.jsのレスポンシブ機能をオフにします。
            responsive: true, 
            maintainAspectRatio: true, // アスペクト比も固定します
            
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: '評価 (％)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                },
                title: {
                    display: true,
                    text: '「良好サイン」「注意サイン」「悪化サイン」の総合評価'
                }
            }
        }
    });
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
