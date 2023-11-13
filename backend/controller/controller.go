package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"gunmamon/model"
	"io"
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
	return c.String(http.StatusOK, "ok")
}

// トップページのエンドポイント
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

	//fit apiにリクエスト
	// 期間は1年前から今日まで
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
	arrayData := [365]int{}
	for _, p := range fitResponse.Point {
		intVal := p.Value[0].IntVal
		// 日付に変換
		startNanoTimeStamp, err := strconv.ParseInt(p.StartTimeNanos, 10, 64)
		if err != nil {
			fmt.Println("strconv.ParseInt error", err)
			return c.String(http.StatusInternalServerError, "strconv.ParseInt error")
		}
		endNanoTimeStamp, err := strconv.ParseInt(p.EndTimeNanos, 10, 64)
		if err != nil {
			fmt.Println("strconv.ParseInt error", err)
			return c.String(http.StatusInternalServerError, "strconv.ParseInt error")
		}
		startTimeJst := time.Unix(0, startNanoTimeStamp).In(jst)
		endTimeJst := time.Unix(0, endNanoTimeStamp).In(jst)
		fmt.Println(startTimeJst.Format("2006年01月02日 15時04分05秒") + " ~ " + endTimeJst.Format("2006年01月02日 15時04分05秒") + " : " + strconv.Itoa(intVal) + "歩")

		// 現在の日付とstartTimeJstの日付の差の日数を計算
		nowDate := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, jst)
		sub := nowDate.Sub(startTimeJst)
		diffDay := int(sub.Hours() / 24)
		arrayData[diffDay] += intVal

		// 曜日を考慮する

	}
	fmt.Println(arrayData)

	// 数値データ
	// data := []int{0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
	// 	4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
	// 	4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
	// 	4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	// 	4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
	// 	4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
	// 	4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
	// 	4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 0}

	width := 10
	wrapScope := 7
	blank := 2
	mx := 30
	my := 30
	px := 30 + mx
	py := 30 + my
	maxWidth := strconv.Itoa(len(arrayData)/wrapScope*(width+blank) + px + mx)
	maxHeight := (width+blank)*wrapScope + py + my
	bgColor := "white"

	// svgの初期化
	svg := `<svg width="` + maxWidth + `" height="` + strconv.Itoa(maxHeight) + `" xmlns="http://www.w3.org/2000/svg">`
	svg += `<rect width="100%" height="100%" fill="` + bgColor + `" />`

	// データの描画
	for i, d := range arrayData {
		x := (i/wrapScope)*(width+blank) + px
		y := (i%wrapScope)*(width+blank) + py
		fill := "#0e4429"
		if d >= 10000 {
			fill = "#006d32"
		} else if d >= 5000 {
			fill = "#006d32"
		} else if d >= 3000 {
			fill = "#39d353"
		} else if d >= 1000 {
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
		fontSize := 12
		x := mx
		y := py + fontSize + i*2*(width+blank) + width + blank
		svg += `
			<text x="` + strconv.Itoa(x) + `" y="` + strconv.Itoa(y) + `" font-family="Arial" font-size="` + strconv.Itoa(fontSize) + `" fill="black" style="animation: scale 1s ease;">` + c + `</text>
		`
	}

	// 月
	months := []string{"Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"}
	for i, m := range months {
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
