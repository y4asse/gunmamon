package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/mongo"
	"fmt"
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

// テスト用のエンドポイント
func (controller *controller) Ok(c echo.Context) error {
	fmt.Println("ok desu")
	return c.String(http.StatusOK, "ok")
}

// トップページのエンドポイント
func (controller *controller) IndexHandler(c echo.Context) error {
	client := controller.client
	userCollection := client.Database("Cluster0").Collection("User")
	// パラメータの取得
	id := c.QueryParam("id")
	colorType := c.QueryParam("color_type")
	bgColorType := c.QueryParam("bg_color_type")
	dataType := c.QueryParam("type")
	if dataType == "" {
		dataType = "step_count"
	}

	switch dataType {
	case "step_count":
		return StepCountHandler(id, c, userCollection, colorType, bgColorType)
		// TODO 心拍数の実装
		// case "heart_beat":
		// 	return HeartBeatHandler(id, c, userCollection, colorType)
	}
	return c.String(http.StatusBadRequest, "Bad Request")
}
