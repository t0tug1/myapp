# ステージ1: 開発ステージ (Node.jsイメージを使用)
FROM node:22.20.0 AS dev

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとyarn.lockをコピー
COPY package.json yarn.lock ./

# 依存関係インストール
RUN yarn install --frozen-lockfile

# アプリケーションのソースコードをコピー
# ソースコードは、このDockerfileと同じディレクトリにあると想定
COPY . .

# アプリケーションがリッスンするポートを公開 (Expressのデフォルトは3000と仮定)
EXPOSE 3000
