基本的にローカルでのGoのversionが1.21以上であればローカル実行しても構いません。（そっちの方が速い）

Goの環境構築が面倒な場合は、Dockerを使ってください。
以下のコマンドでコンテナが立ち上がります。
```
docker-compose build
docker-compose up
```
localhost:8080でアクセスできるはずです。