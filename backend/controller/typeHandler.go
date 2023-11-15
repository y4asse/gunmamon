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

func StepCountHandler(id string, c echo.Context, userCollection *mongo.Collection, colorType string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.String(http.StatusBadRequest, "Bad Request")
	}

	// TODO colorTypeによって色を変える
	L0C := "#161b22"
	L1C := "#0e4429"
	L2C := "#006d32"
	L3C := "#26a641"
	L4C := "#39d353"
	L4 := 10000
	L3 := 5000
	L2 := 3000
	L1 := 1000

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
		endNanoTimeStamp, err := strconv.ParseInt(p.EndTimeNanos, 10, 64)
		if err != nil {
			fmt.Println("strconv.ParseInt error", err)
			return c.String(http.StatusInternalServerError, "strconv.ParseInt error")
		}

		startTimeJst := time.Unix(0, startNanoTimeStamp).In(jst)
		endTimeJst := time.Unix(0, endNanoTimeStamp).In(jst)
		fmt.Println(startTimeJst.Format("2006年01月02日 15時04分05秒") + " ~ " + endTimeJst.Format("2006年01月02日 15時04分05秒") + " : " + strconv.Itoa(intVal) + "歩")

		// 配列のインデックスを計算
		nowDate := time.Date(now.Local().Year(), now.Local().Month(), now.Local().Day(), 0, 0, 0, 0, jst)
		nowWeekday := int(nowDate.Weekday()) // 0 : Sun, 1 : Mon, ...
		subTime := nowDate.Sub(time.Date(startTimeJst.Year(), startTimeJst.Month(), startTimeJst.Day(), 0, 0, 0, 0, jst))
		diffDayFromNow := int(subTime.Hours() / 24)
		diffDayFromNowWeekSun := diffDayFromNow - nowWeekday
		diffWeek := int(math.Ceil((float64(diffDayFromNowWeekSun) / 7)))
		arrayData[diffWeek][startTimeJst.Weekday()] += intVal
	}

	width := 10
	wrapScope := 7
	blank := 2
	mx := 30
	my := 30
	px := 30 + mx
	py := 30 + my
	maxWidth := strconv.Itoa(len(arrayData)*7/wrapScope*(width+blank) + px + mx)
	maxHeight := (width+blank)*wrapScope + py + my
	bgColor := "white"

	// svgの初期化
	svg := `<svg width="` + maxWidth + `" height="` + strconv.Itoa(maxHeight) + `" xmlns="http://www.w3.org/2000/svg">`
	svg += `<rect width="100%" height="100%" fill="` + bgColor + `" />`

	// データの描画
	// arrayDataを逆から
	for i, weekData := range arrayData {
		x := (len(arrayData)-i-1)*(width+blank) + px
		for j, d := range weekData {
			fill := L0C
			y := j*(width+blank) + py
			if d >= L4 {
				fill = L4C
			} else if d >= L3 {
				fill = L3C
			} else if d >= L2 {
				fill = L2C
			} else if d >= L1 {
				fill = L1C
			}
			svg += `<rect key="` + strconv.Itoa(i) +
				`" x="` + strconv.Itoa(x) +
				`" y="` + strconv.Itoa(y) +
				`" width="` + strconv.Itoa(width) +
				`" height="` + strconv.Itoa(width) +
				`" fill="` + fill +
				`" rx="2" ry="2" style="animation: fadeInFromBottom 1s ease ` + strconv.FormatFloat(float64(float32(i)*0.002), 'f', -1, 32) + `s forwards; opacity: 0"/>`
		}
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
	months := [12]string{}
	for i := 0; i < 12; i++ {
		switch (int(now.Month()) + i + 1) % 12 {
		case 0:
			months[i] = "Dec"
		case 1:
			months[i] = "Jan"
		case 2:
			months[i] = "Feb"
		case 3:
			months[i] = "Mar"
		case 4:
			months[i] = "Apr"
		case 5:
			months[i] = "May"
		case 6:
			months[i] = "Jun"
		case 7:
			months[i] = "Jul"
		case 8:
			months[i] = "Aug"
		case 9:
			months[i] = "Sep"
		case 10:
			months[i] = "Oct"
		case 11:
			months[i] = "Nov"
		}
	}
	for i, m := range months {
		x := px + (width+blank)*i*53/12
		y := py - 2
		svg += `<text x="` + strconv.Itoa(x) + `" y="` + strconv.Itoa(y) + `" font-family="Arial" font-size="12" fill="black" style="animation: scale 1s ease;">` + m + `</text>`
	}

	// アニメーション
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
