package main

import (
	"context"
	"gunmamon/controller"
	"gunmamon/db"
	"gunmamon/router"
	"log"
	"os"
)

func main() {
	client := db.NewDb()
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	//　ルーティング
	controller := controller.NewController(client)
	e := router.NewRouter(controller)

	// ポートの設定
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}
	e.Logger.Fatal(e.Start(":" + port))
}
