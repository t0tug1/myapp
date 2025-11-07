      // グラフを描画するためのキャンバス要素を生成する関数
      const result = document.getElementById("js-result");
      const createCanvas = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 200;
        result.appendChild(canvas);
        return canvas;
      };

      // ここに試したいchart機能を入れます
const lineChart = new Chart(createCanvas(), {
  type: "line",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"], // X軸のラベル
    datasets: [{
      label: "Sales", // データセットのラベル
      data: [12, 19, 3, 5, 2, 3, 10], // Y軸のデータ
      borderColor: "rgb(75, 192, 192)", // 線の色
      tension: 0.1, // 線のカーブの緩やかさ
    }],
  },
  options: {
    responsive: true, // 画面サイズに応じてリサイズ
    scales: {
      y: {
        beginAtZero: true, // Y軸の開始値を0に設定
      },
    },
  },
});
    