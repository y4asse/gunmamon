package controller

import (
	"strconv"
	"time"
)

func CreateSVG(arrayData [53][7]int, colorType string, bgColor string, textColor string) string {
	// textColor="#ffffff" みたいな感じでくる
	if bgColor == "" {
		bgColor = "#ffffff" // 白
	}
	if textColor == "" {
		textColor = "#000000" // 黒
	}
	L0C := "#EBEDF0"
	L1C := "#cc99ff"
	L2C := "#9966cc"
	L3C := "#6600cc"
	L4C := "#330066"

	switch colorType {
	case "red":
		L0C = "#EBEDF0"
		L1C = "#cc9999"
		L2C = "#cc6666"
		L3C = "#cc3333"
		L4C = "#cc0000"

	case "pink":
		L0C = "#EBEDF0"
		L1C = "#ff99cc"
		L2C = "#ff3399"
		L3C = "#ff0066"
		L4C = "#990033"

	case "orange":
		L0C = "#EBEDF0"
		L1C = "#ff9966"
		L2C = "#ff6600"
		L3C = "#ff3300"
		L4C = "#cc3300"

	case "yellow":
		L0C = "#EBEDF0"
		L1C = "#ffcc66"
		L2C = "#ffcc33"
		L3C = "#cc9933"
		L4C = "#977100"

	case "green":
		L0C = "#EBEDF0"
		L1C = "#39d353"
		L2C = "#26a641"
		L3C = "#006d32"
		L4C = "#0e4429"

	case "light-blue":
		L0C = "#EBEDF0"
		L1C = "#99ccff"
		L2C = "#3399ff"
		L3C = "#0066ff"
		L4C = "#003399"

	case "blue":
		L0C = "#EBEDF0"
		L1C = "#9999cc"
		L2C = "#6666cc"
		L3C = "#3333cc"
		L4C = "#0000cc"

	case "purple":
		L0C = "#EBEDF0"
		L1C = "#cc99ff"
		L2C = "#9966cc"
		L3C = "#6600cc"
		L4C = "#330066"
	}

	// 歩数の閾値
	L4 := 10000
	L3 := 5000
	L2 := 3000
	L1 := 1000

	width := 10
	wrapScope := 7
	blank := 2
	mx := 30
	my := 30
	px := 30 + mx
	py := 30 + my
	maxWidth := strconv.Itoa(len(arrayData)*7/wrapScope*(width+blank) + px + mx)
	maxHeight := (width+blank)*wrapScope + py + my

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
		<text x="` + strconv.Itoa(mx) + `" y="` + strconv.Itoa(my) + `" font-family="Arial" font-size="20" fill="` + textColor + `" style="animation: scale 1s ease;">` + title + `</text>
	`
	// 曜日
	content := []string{"Mon", "Wed", "Fri"}
	for i, c := range content {
		fontSize := 12
		x := mx
		y := py + fontSize + i*2*(width+blank) + width + blank
		svg += `
			<text x="` + strconv.Itoa(x) + `" y="` + strconv.Itoa(y) + `" font-family="Arial" font-size="` + strconv.Itoa(fontSize) + `" fill="` + textColor + `" style="animation: scale 1s ease;">` + c + `</text>
		`
	}

	// 月
	months := [12]string{}
	for i := 0; i < 12; i++ {
		switch (int(time.Now().Local().Month()) + i + 1) % 12 {
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
		svg += `<text x="` + strconv.Itoa(x) + `" y="` + strconv.Itoa(y) + `" font-family="Arial" font-size="12" fill="` + textColor + `" style="animation: scale 1s ease;">` + m + `</text>`
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
	return svg
}
