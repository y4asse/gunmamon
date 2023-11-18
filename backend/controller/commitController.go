package controller

import (
	"context"
	"fmt"
	"gunmamon/model"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CommitHandler(id string, c echo.Context, commitCollection *mongo.Collection, colorType string, bgColor string, textColor string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}

	// mongoからuser_idが一致するものをすべて取得
	cursor, err := commitCollection.Find(context.TODO(), bson.D{{Key: "user_id", Value: objID}})
	if err != nil {
		return c.String(http.StatusInternalServerError, "Internal Server Error")
	}
	defer cursor.Close(context.TODO())

	var commits []model.Commit // ここで定義された Commit 構造体を使用
	if err = cursor.All(context.TODO(), &commits); err != nil {
		fmt.Println(err)
		return c.String(http.StatusInternalServerError, "Error while decoding commits")
	}

	// データの作成
	arrayData := [53][7]int{}
	now := time.Now().Local()
	jst, _ := time.LoadLocation("Asia/Tokyo")
	nowDate := time.Date(now.Local().Year(), now.Local().Month(), now.Local().Day(), 0, 0, 0, 0, jst)
	for _, commit := range commits {
		createdAt := time.Date(commit.CreatedAt.Year(), commit.CreatedAt.Month(), commit.CreatedAt.Day(), 0, 0, 0, 0, jst)
		diffDayFromNow := int(nowDate.Sub(createdAt).Hours() / 24)
		fmt.Println(diffDayFromNow)
		arrayData[diffDayFromNow/7][createdAt.Weekday()] += 1000 + commit.Minitue*50
	}

	svg := CreateSVG(arrayData, colorType, bgColor, textColor)
	return c.Blob(http.StatusOK, "image/svg+xml", []byte(svg))
}
