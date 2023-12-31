package controller

import (
	"net/http"

	"fmt"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/mongo"
)

type IController interface {
	Ok(c echo.Context) error
	IndexHandler(c echo.Context) error
	SampleHandler(c echo.Context) error
}

type controller struct {
	client *mongo.Client
}

func NewController(client *mongo.Client) IController {
	return &controller{client}
}

// テスト用のエンドポイント
func (controller *controller) Ok(c echo.Context) error {
	fmt.Println("ok desu")
	return c.String(http.StatusOK, "ok")
}

// サンプルページのエンドポイント
func (controller *controller) SampleHandler(c echo.Context) error {
	colorType := c.QueryParam("color_type")
	bgColor := c.QueryParam("bg_color")
	textColor := c.QueryParam("text_color")

	// サンプルデータの作成
	sampleData := [53][7]int{}
	for i := 0; i < 53; i++ {
		if i < 10 {
			sampleData[i] = [7]int{100001, 100001, 100001, 100001, 100001, 100001, 100001}
		} else if i < 20 {
			sampleData[i] = [7]int{5001, 5001, 5001, 5001, 5001, 5001, 5001}
		} else if i < 30 {
			sampleData[i] = [7]int{3001, 3001, 3001, 3001, 3001, 3001, 3001}
		} else if i < 40 {
			sampleData[i] = [7]int{1001, 1001, 1001, 1001, 1001, 1001, 1001}
		} else {
			sampleData[i] = [7]int{0, 0, 0, 0, 0, 0, 0}

		}
	}
	svg := CreateSVG(sampleData, colorType, bgColor, textColor)
	return c.Blob(http.StatusOK, "image/svg+xml", []byte(svg))
}

// トップページのエンドポイント
func (controller *controller) IndexHandler(c echo.Context) error {
	client := controller.client
	userCollection := client.Database("Cluster0").Collection("User")
	commitCollection := client.Database("Cluster0").Collection("Commit")
	// パラメータの取得
	id := c.QueryParam("id")
	colorType := c.QueryParam("color_type")
	bgColor := c.QueryParam("bg_color")
	textColor := c.QueryParam("text_color")
	dataType := c.QueryParam("type")
	if dataType == "" {
		dataType = "step_count"
	}

	switch dataType {
	case "step_count":
		return StepCountHandler(id, c, userCollection, colorType, bgColor, textColor)
	case "commit":
		return CommitHandler(id, c, commitCollection, colorType, bgColor, textColor)
	}
	return c.String(http.StatusBadRequest, "Bad Request")
}
