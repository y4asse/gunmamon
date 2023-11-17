package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"gunmamon/model"
	"io"
	"math"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func StepCountHandler(id string, c echo.Context, userCollection *mongo.Collection, colorType string, bgColor string, textColor string) error {
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
	user := model.User{}
	if err := json.Unmarshal(jsonData, &user); err != nil {
		return c.String(http.StatusInternalServerError, "json unmarshal error")
	}

	// access tokenの取得
	httpClient := &http.Client{}
	oauthUrl := "https://accounts.google.com/o/oauth2/token"
	encodeBody := url.Values{}
	encodeBody.Add("refresh_token", user.RefreshToken)
	encodeBody.Add("grant_type", "refresh_token")
	encodeBody.Add("redirect_uri", os.Getenv("REDIRECT_URI"))
	encodeBody.Add("client_secret", os.Getenv("CLIENT_SECRET"))
	encodeBody.Add("client_id", os.Getenv("CLIENT_ID"))
	encodeBody.Add("scope", "https://www.googleapis.com/auth/fitness.activity.read")

	oauthReq, err := http.NewRequest("POST", oauthUrl, strings.NewReader(encodeBody.Encode()))
	if err != nil {
		fmt.Println("HTTP Request Failed:", err)
		return c.String(http.StatusInternalServerError, "Internal server error : HTTP Request Failed")
	}
	oauthReq.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	restp, err := httpClient.Do(oauthReq)
	if err != nil {
		fmt.Println("HTTP Request Failed:", err)
		return c.String(http.StatusInternalServerError, "Internal server error : HTTP Request Failed")
	}
	defer restp.Body.Close()
	oauthBody, _ := io.ReadAll(restp.Body)

	oauthResponse := model.OauthResponse{}
	if err := json.Unmarshal(oauthBody, &oauthResponse); err != nil {
		fmt.Println("json unmarshal error", err)
		return c.String(http.StatusInternalServerError, "json unmarshal error")
	}

	// fit apiにリクエスト
	now := time.Now().Local()
	from := now.AddDate(-1, 0, 0).UnixNano()
	to := now.UnixNano()
	timeRange := fmt.Sprintf("%d-%d", from, to)
	dataSourceId := "derived:com.google.step_count.delta:com.google.ios.fit:appleinc.:iphone:6fc8be7f:top_level"
	token := oauthResponse.Access_token
	url := fmt.Sprintf("https://www.googleapis.com/fitness/v1/users/me/dataSources/%s/datasets/%s", dataSourceId, timeRange)
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("Authorization", "Bearer "+token)
	res, err := httpClient.Do(req)
	if err != nil {
		fmt.Println("HTTP Request Failed:", err)
		return c.String(http.StatusInternalServerError, "Internal server error : HTTP Request Failed")
	}
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)
	fitResponse := model.FitResponse{}
	if err := json.Unmarshal(body, &fitResponse); err != nil {
		fmt.Println("json unmarshal error", err)
		return c.String(http.StatusInternalServerError, "json unmarshal error")
	}

	// データの整形
	if err != nil {
		fmt.Println("strconv.ParseInt error", err)
		return c.String(http.StatusInternalServerError, "strconv.ParseInt error")
	}
	jst, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		fmt.Println("time.LoadLocation error", err)
		return c.String(http.StatusInternalServerError, "time.LoadLocation error")
	}

	// 週ごとに分ける処理
	arrayData := [53][7]int{}
	for _, p := range fitResponse.Point {
		intVal := p.Value[0].IntVal
		// 日付に変換
		startNanoTimeStamp, err := strconv.ParseInt(p.StartTimeNanos, 10, 64)
		if err != nil {
			fmt.Println("strconv.ParseInt error", err)
			return c.String(http.StatusInternalServerError, "strconv.ParseInt error")
		}
		if err != nil {
			fmt.Println("strconv.ParseInt error", err)
			return c.String(http.StatusInternalServerError, "strconv.ParseInt error")
		}

		startTimeJst := time.Unix(0, startNanoTimeStamp).In(jst)

		// 配列のインデックスを計算
		nowDate := time.Date(now.Local().Year(), now.Local().Month(), now.Local().Day(), 0, 0, 0, 0, jst)
		nowWeekday := int(nowDate.Weekday()) // 0 : Sun, 1 : Mon, ...
		subTime := nowDate.Sub(time.Date(startTimeJst.Year(), startTimeJst.Month(), startTimeJst.Day(), 0, 0, 0, 0, jst))
		diffDayFromNow := int(subTime.Hours() / 24)
		diffDayFromNowWeekSun := diffDayFromNow - nowWeekday
		diffWeek := int(math.Ceil((float64(diffDayFromNowWeekSun) / 7)))
		arrayData[diffWeek][startTimeJst.Weekday()] += intVal
	}

	svg := CreateSVG(arrayData, colorType, bgColor, textColor)
	return c.Blob(http.StatusOK, "image/svg+xml", []byte(svg))
}
