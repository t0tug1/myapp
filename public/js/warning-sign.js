/**
 * ページのHTMLをコンテナに挿入し、イベントを設定する関数
 * @param {HTMLElement} container - HTMLを挿入する先のコンテナ要素
 */

// 警告サインページを生成する関数
export function loadWarningSignContent(container) {

    // 挿入するHTMLコンテンツ
    container.innerHTML = `
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
    `;

    // 現在アクティブなコンテンツをすべて非表示にする
    const allTabPanes = document.querySelectorAll('.tab-content .tab-pane');
    allTabPanes.forEach(pane => {
        pane.classList.remove('active', 'show'); // .active と .show を削除
    });

    // デフォルトのコンテンツ (five-step-content) を強制的に表示する
    const defaultPane = document.getElementById('five-step-content');
    if (defaultPane) {
        defaultPane.classList.add('active', 'show'); // .active と .show を追加
    }

    // HTML挿入後に、Bootstrapタブのイベントリスナーをセットアップ
    setupDynamicBootstrapTabs(container);

    //グラフ・表 生成関数呼び出し
    drawWarningSignLineGraphs();
    drawWarningSignBarGraphs();
    drawWarningSignTable();
}

// 折れ線グラフを描画する関数
function drawWarningSignLineGraphs() {
    const lineGraph = document.getElementById("line-graph");
    const createCanvas = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 200;
        lineGraph.appendChild(canvas);
        return canvas;
    };

    // グラフが複数回描画されないように、既存のグラフをクリアする
    lineGraph.innerHTML = '';

    const lineChart = new Chart(createCanvas(), {
        type: "line",
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "Sales",
                data: [12, 19, 3, 5, 2, 3, 10],
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// 棒グラフを描画する関数
function drawWarningSignBarGraphs() {
    const barGraph = document.getElementById("bar-graph");
    const createCanvas = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 200;
        barGraph.appendChild(canvas);
        return canvas;
    };

    // グラフが複数回描画されないように、既存のグラフをクリアする
    barGraph.innerHTML = '';

    const barChart = new Chart(createCanvas(), {
        type: "bar",
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: "# of Votes",
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// 表を描画する関数
function drawWarningSignTable(){
    //Define variables for input elements
    var fieldEl = document.getElementById("filter-field");
    var typeEl = document.getElementById("filter-type");
    var valueEl = document.getElementById("filter-value");

    //Custom filter example
    function customFilter(data){
        return data.car && data.rating < 3;
    }

    //Trigger setFilter function with correct parameters
    function updateFilter(){
    var filterVal = fieldEl.options[fieldEl.selectedIndex].value;
    var typeVal = typeEl.options[typeEl.selectedIndex].value;

    var filter = filterVal == "function" ? customFilter : filterVal;

    if(filterVal == "function" ){
        typeEl.disabled = true;
        valueEl.disabled = true;
    }else{
        typeEl.disabled = false;
        valueEl.disabled = false;
    }

    if(filterVal){
        table.setFilter(filter,typeVal, valueEl.value);
    }
    }

    //Update filters on value change
    document.getElementById("filter-field").addEventListener("change", updateFilter);
    document.getElementById("filter-type").addEventListener("change", updateFilter);
    document.getElementById("filter-value").addEventListener("keyup", updateFilter);

    //Clear filters on "Clear Filters" button click
    document.getElementById("filter-clear").addEventListener("click", function(){
    fieldEl.value = "";
    typeEl.value = "=";
    valueEl.value = "";

    table.clearFilter();
    });

    //Build Tabulator
    var table = new Tabulator("#example-table", {
        data:[
            {id:1, name:"田中太郎", gender:"男", dob:29, hobby:"読書"},
            {id:2, name:"鈴木花子", gender:"女", dob:40, hobby:"旅行"},
            {id:3, name:"佐藤健", gender:"男", dob:14, hobby:"映画鑑賞"}
        ],

        height:"311px",
        layout:"fitColumns",
        columns:[
        {title:"Name", field:"name", width:200},
        {title:"Progress", field:"progress", hozAlign:"right", sorter:"number"},
        {title:"Gender", field:"gender", widthGrow:2},
        {title:"Rating", field:"rating", hozAlign:"center"},
        {title:"Favourite Color", field:"col", widthGrow:3},
        {title:"age", field:"dob", hozAlign:"center", sorter:"date", widthGrow:2},
        {title:"Driver", field:"hobby", hozAlign:"center"},
        ],
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
