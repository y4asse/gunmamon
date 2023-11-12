package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type IController interface {
	Ok(c echo.Context) error
	IndexHandler(c echo.Context) error
}

type controller struct {
	client *mongo.Client
}

func NewController(client *mongo.Client) IController {
	return &controller{client}
}

func (controller *controller) Ok(c echo.Context) error {
	return c.String(http.StatusOK, "ok")
}

func (controller *controller) IndexHandler(c echo.Context) error {
	client := controller.client
	userCollection := client.Database("Cluster0").Collection("User")
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
		fmt.Println(err)
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

	width := 15
	wrapScope := 7
	blank := 2
	mx := 30
	my := 30
	px := 30 + mx
	py := 30 + my
	maxWidth := strconv.Itoa(len(data)/wrapScope*(width+blank) + px + mx)
	maxHeight := (width+blank)*wrapScope + py + my
	bgColor := "white"

	// svgの初期化
	svg := `<svg width="` + maxWidth + `" height="` + strconv.Itoa(maxHeight) + `" xmlns="http://www.w3.org/2000/svg">`
	svg += `<rect width="100%" height="100%" fill="` + bgColor + `" />`

	// データの描画
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
			`" rx="2" ry="2" style="animation: fadeInFromBottom 1s ease ` + strconv.FormatFloat(float64(float32(i)*0.002), 'f', -1, 32) + `s forwards; opacity: 0"/>`
	}

	// タイトル
	title := "Step count"
	svg += `
		<text x="` + strconv.Itoa(mx) + `" y="` + strconv.Itoa(my) + `" font-family="Arial" font-size="20" fill="black" style="animation: scale 1s ease;">` + title + `</text>
	`
	// 曜日
	content := []string{"Mon", "Wed", "Fri"}
	for i, c := range content {
		x := mx
		y := my + 50 + i*25
		svg += `
			<text x="` + strconv.Itoa(x) + `" y="` + strconv.Itoa(y) + `" font-family="Arial" font-size="12" fill="black" style="animation: scale 1s ease;">` + c + `</text>
		`
	}

	// 月
	month := []string{"Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"}
	for i, m := range month {
		x := px + 40*i
		y := py - 2
		svg += `<text x="` + strconv.Itoa(x) + `" y="` + strconv.Itoa(y) + `" font-family="Arial" font-size="12" fill="black" style="animation: scale 1s ease;">` + m + `</text>`
	}

	svg += `
		<style>
			@keyframes fadeInFromBottom {
				0% { opacity: 0; transform: translateY(10px); }
				50% { opacity: 50%; transform: translateY(-10px); }
				100% { opacity: 1;transform: translateY(0); }
			}
			@keyframes fadeIn {
				from { opacity: 0; }
				to { opacity: 1;}
			}
			@keyframes scale {
				from { transform: scale(0); }
				to { transform: scale(1); }
          	}
		</style>
	`
	svg += `</svg>`
	return c.Blob(http.StatusOK, "image/svg+xml", []byte(svg))
}
