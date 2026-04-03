# 図書システム(名称未定)

## 開発方法

1. `bun i`
2. `docker compose up -d`
3. \_envファイルを.envにコピー
4. 各環境変数を埋める
   1. BETTERAUTH_SECRET - ランダムな英数字の羅列を挿入
   2. GOOGLE_CLIENT_ID / SECRET - Google API PlatformのClient ID / Secretです。詳しくは後述します。
   3. BETTER_AUTH_URL - 動かすURLを入力
   4. DATABASE_URL - DBのURI。デフォルトでdocker-compose.yamlを動かした場合のものを入力済み
   5. SMTP_HOST / SMT_... - メールの設定。パスワードリセットやメール認証で用いられます。
   6. RAKUTEN_APP_ID / KEY - 楽天APIの設定です。これを設定することにより、ISBNコードの検索が容易になります。詳しくは後述します。
5. `prisma generate`
6. `prisma migrate dev`
7. `bun dev`

### PullRequestの送信について

適切な説明を入力して送信してください。

### Google OAuth 2.0 / OIDC について

Google Client ID等については下記記事を参考にしてください。

https://zenn.dev/milky/articles/google-client-oauth
