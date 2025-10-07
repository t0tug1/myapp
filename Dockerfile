# ベースイメージ（Node.js 20を使用）
FROM node:22

# コンテナ内の作業ディレクトリを指定
WORKDIR /app

# package.json と yarn.lock をコピー
COPY package*.json yarn.lock* ./

# 依存関係をインストール
RUN corepack enable && yarn install

# アプリケーションのソースコードをコピー
COPY . .

# アプリを起動するポート（例: 3000）
EXPOSE 3000

# デフォルトの起動コマンド
CMD ["yarn", "start"]