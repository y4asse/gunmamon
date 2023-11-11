# ぐんまもん 🐴

<br>

## 📚 開発ルール

### Commit Message

```
feat: 新しい機能
fix: バグの修正
docs: ドキュメントのみの変更
refactor: 仕様に影響がないコード改善(リファクタ)
chore: ビルド、補助ツール、ライブラリ関連
```

### Branch Name

```
feat/機能名
fix/修正箇所
docs/ドキュメント名
refactor/機能名
chore/機能名

ex) feat/add_login
```
## URL

|フロントサーバ|https://gunmamon.vercel.app|
|---|---|
|APIサーバ|https://high-wave-403814.an.r.appspot.com|

## 📚ドキュメント
|フロント README|https://github.com/y4asse/gunmamon/blob/main/frontend/README.md|
|---|---|
|API README|https://github.com/y4asse/gunmamon/blob/main/backend/README.md|

## 機能ごとにIssueを切って開発を進めます
1人分が実装できる機能ごとにIssueを切ってください。
それぞれ自分のやりたい機能があれば自由にIssueを切っても構いません！自分がやりたかったら自分をアサインしてください！

すでにあるIssueを参考にしたり、テンプレートがあるのでそれに従ってIssueを切ってください。

## デプロイの流れ
|フロント|releaseブランチにpush, mergeされたらVercelによって自動でデプロイされる|
|---|---|
|API|y4asseが手動でデプロイするので連絡してください|

## アカウント認証とFit APIリクエストの流れ
1. `/`Googleで認証を押すとGoogle認証のページへ飛ぶ
2. `/callback`にリダイレクトされる
3. URLのparamsに`code`があるので取得
4. codeをもとにアクセストークンを取得
```
  curl 
  -d code=3で取得した認可コード 
  -d client_id=クライアントID
  -d client_secret=クライアントシークレット
  -dredirect_uri=リダイレクトURI
  -d grant_type=authorization_code 
  https://accounts.google.com/o/oauth2/token
```
※この手順は初回認証のみ可能。初回以降でaccess tokenを取得するには初回に渡されるrefresh tokenを利用して以下のリクエストを送る。
```
  curl 
  -d refresh_token=保存しておいたrefresh token
  -d client_id=クライアントID
  -d client_secret=クライアントシークレット
  -dredirect_uri=リダイレクトURI
  -d grant_type=refresh_token 
  https://accounts.google.com/o/oauth2/token
```
5. 4で取得したアクセストークンをもとにGoogle fit apiにリクエスト
   <br/>
これは歩数(iphone)を取得するリクエストの例
```
  https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.step_count.delta:com.google.ios.fit:appleinc.:iphone:6fc8be7f:top_level/datasets/1699142400000000000-1699315200000000000

  Headerに以下を含める
  Authorization Bearer accessToken
```

