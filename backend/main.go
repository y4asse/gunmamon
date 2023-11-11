package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"

	"strconv"

	"github.com/labstack/echo/v4"
)

var userCollection *mongo.Collection

func main() {
	// envファイルの読み込み
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	uri := os.Getenv("MONGODB_URI")

	// DBに接続
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	userCollection = client.Database("Cluster0").Collection("User")

	if err != nil {
		panic(err)
	}
	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	// Ping the primary
	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}
	fmt.Println("Successfully connected and pinged.")

	//　ルーティング
	e := echo.New()
	e.GET("/ok", Ok)
	e.GET("/", IndexHandler)

	// ポートの設定
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}
	e.Logger.Fatal(e.Start(":" + port))
}

func Ok(c echo.Context) error {
	return c.String(http.StatusOK, "ok")
}

func IndexHandler(c echo.Context) error {
	// パラメータの取得
	id := c.QueryParam("id")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}

	var result bson.M
	err = userCollection.FindOne(context.TODO(), bson.D{{Key: "_id", Value: objID}}).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.String(http.StatusNotFound, "Not Found")
		}
		return c.String(http.StatusInternalServerError, "Internal Server Error")
	}
	jsonData, err := json.MarshalIndent(result, "", "    ")
	if err != nil {
		panic(err)
	}
	// jsonから構造体への変換

	fmt.Println(string(jsonData))
	//{"_id": "654f4152be05193dc750ed80","createdAt": "2023-11-11T08:54:42.043Z","refreshToken": "1//0eVvM-bSHHUFDCgYIARAAGA4SNwF-L9IrNTg-PAfGWiQhEpDNbKW83WXCMik-zf4-1UJLPsLz5gfz56o44-I75z3rGWIrbMeOGAI"}

	data := []int{0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
		4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
		4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
		4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
		4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
		4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
		4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 0}

	width := 10
	wrapScope := 7
	blank := 2
	px := 30
	py := 30
	maxWidth := strconv.Itoa(len(data)/wrapScope*(width+blank) + px)
	maxHeight := (width+blank)*wrapScope + py
	svg := `<svg width="` + maxWidth + `" height="` + strconv.Itoa(maxHeight) + `" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="transparent" />`
	for i, d := range data {
		x := (i/wrapScope)*(width+blank) + px
		y := (i%wrapScope)*(width+blank) + py
		fill := "#0e4429"
		switch d {
		case 3:
			fill = "#006d32"
		case 2:
			fill = "#26a641"
		case 1:
			fill = "#39d353"
		case 0:
			fill = "#161b22"
		}
		svg += `<rect key="` + strconv.Itoa(i) +
			`" x="` + strconv.Itoa(x) +
			`" y="` + strconv.Itoa(y) +
			`" width="` + strconv.Itoa(width) +
			`" height="` + strconv.Itoa(width) +
			`" fill="` + fill +
			`" rx="2" ry="2" style="animation: fadeInFromBottom 2s ease ` + strconv.FormatFloat(float64(float32(i)*0.001), 'f', -1, 32) + `s forwards; opacity: 0"/>`
	}
	svg += `
		<text x="0" y="50" font-family="Arial" font-size="12" fill="black" style="animation: fadeIn 2s ease;">aon</text>
		<text x="0" y="75" font-family="Arial" font-size="12" fill="black">Wed</text>
		<text x="0" y="100" font-family="Arial" font-size="12" fill="black">Fri</text>
		<style>
			@keyframes fadeInFromBottom {
				from { opacity: 0; transform: translateY(10px); }
				to { opacity: 1;transform: translateY(0); }
			}
			@keyframes fadeIn {
				from { opacity: 0; }
				to { opacity: 1;}
			}
		</style>
	`
	svg += `</svg>`
	return c.Blob(http.StatusOK, "image/svg+xml", []byte(svg))
}
