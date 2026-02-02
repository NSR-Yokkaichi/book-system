# 図書システム(名称未定)

## 開発方法

1. `bun i`
2. `docker compose up -d`
3. \_envファイルを.envにコピー
4. 各環境変数を埋める
   1. BETTERAUTH_SECRET - ランダムな英数字の羅列を挿入
   2. GOOGLE_CLIENT_ID / SECRET - Google API PlatformのClient ID / Secretです。詳しくは後述します。
5. `prisma generate`
6. `prisma migrate dev`
7. `bun dev`

### PullRequestの送信について

適切な説明を入力して送信してください。

### Google OAuth 2.0 / OIDC について

Google Client ID等については下記記事を参考にしてください。

https://zenn.dev/milky/articles/google-client-oauth
