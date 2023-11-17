# SVGを配信するAPIサーバ

基本的にローカルでのGoのversionが1.21以上であればローカル実行しても構いません。（そっちの方が速い）
Goの環境構築が面倒な場合は、Dockerを使ってください。

## 💻ローカルの場合
以下のコマンドでAPIサーバが立ち上がります。(多分)
```
go mod tidy
go run main.go
```

## 🐟Dockerの場合
以下のコマンドでコンテナが立ち上がります。
```
docker-compose build
docker-compose up
```

<br/>

どちらの場合もlocalhost:8080でアクセスできるはずです。

# 🌏エンドポイント
```/``` メインで使う部分。クエリにid, typeを入れてSVGを返却する
テストで試したい場合は、https://gunmamon.vercel.app/　にアクセスして、ログインするとIDが表示されるので、それをクエリに渡してください

```/ok``` 環境構築やデプロイのテストに使う

```sample``` サンプルAPI
`/sample?color_type=purple&bg_color=fffff&text_color=ffffff`のようにリクエスト

# 📁フォルダ構成
```main.go``` サーバを作成する

```/db/db.go``` DBの設定し、MongoDBのクライアントを返す。このクライアントを使ってDBにアクセスできる

```/controller/controller.go``` DBを持っていて、処理の内容を書く

```/router/router.go``` ルーティングする。エンドポイントに対してcontrollerを対応させる
