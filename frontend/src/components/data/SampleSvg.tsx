'use client'
const SampleSvg = ({ colorType, bgColor, textColor }: { colorType: string; bgColor: string; textColor: string }) => {
  const arrayData: number[][] = []
  for (let i = 0; i < 53; i++) {
    if (i < 10) {
      arrayData[i] = [100001, 100001, 100001, 100001, 100001, 100001, 100001]
    } else if (i < 20) {
      arrayData[i] = [5001, 5001, 5001, 5001, 5001, 5001, 5001]
    } else if (i < 30) {
      arrayData[i] = [3001, 3001, 3001, 3001, 3001, 3001, 3001]
    } else if (i < 40) {
      arrayData[i] = [1001, 1001, 1001, 1001, 1001, 1001, 1001]
    } else {
      arrayData[i] = [0, 0, 0, 0, 0, 0, 0]
    }
  }
  const data = [
    {
      color: 'red',
      value: ['#cc9999', '#cc6666', '#cc3333', '#cc0000']
    },
    {
      color: 'pink',
      value: ['#ff99cc', '#ff3399', '#ff0066', '#990033']
    },
    {
      color: 'orange',
      value: ['#ff9966', '#ff6600', '#ff3300', '#cc3300']
    },
    {
      color: 'yellow',
      value: ['#ffcc66', '#ffcc33', '#cc9933', '#977100']
    },
    {
      color: 'green',
      value: ['#39d353', '#26a641', '#006d32', '#0e4429']
    },
    {
      color: 'light-blue',
      value: ['#99ccff', '#3399ff', '#0066ff', '#003399']
    },
    {
      color: 'blue',
      value: ['#9999cc', '#6666cc', '#3333cc', '#0000cc']
    },
    {
      color: 'purple',
      value: ['#cc99ff', '#9966cc', '#6600cc', '#330066']
    }
  ]
  const L0C = '#EBEDF0'
  const L1C = data.find((d) => d.color === colorType)!.value[0]
  const L2C = data.find((d) => d.color === colorType)!.value[1]
  const L3C = data.find((d) => d.color === colorType)!.value[2]
  const L4C = data.find((d) => d.color === colorType)!.value[3]

  const L4 = 10000
  const L3 = 5000
  const L2 = 3000
  const L1 = 1000
  let width = 10
  let wrapScope = 7
  let blank = 2
  let mx = 30
  let my = 30
  let px = 30 + mx
  let py = 30 + my
  const maxWidth = ((arrayData.length * 7) / wrapScope) * (width + blank) + px + mx
  const maxHeight = (width + blank) * wrapScope + py + my

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${maxWidth}" height="${maxHeight}" viewBox="0 0 ${maxWidth} ${maxHeight}">`
  svg += `<rect width="100%" height="100%" fill="${bgColor}" />`
  for (let i = 0; i < arrayData.length; i++) {
    const x = (arrayData.length - i - 1) * (width + blank) + px
    for (let j = 0; j < arrayData[i].length; j++) {
      const d = arrayData[i][j]
      let fill = L0C
      const y = j * (width + blank) + py
      if (d >= L4) {
        fill = L4C
      } else if (d >= L3) {
        fill = L3C
      } else if (d >= L2) {
        fill = L2C
      } else if (d >= L1) {
        fill = L1C
      }
      svg += `<rect  key="${i}" x="${x}" y="${y}" width="${width}" height="${width}" fill="${fill}" rx="2" ry="2" />`
    }
  }
  const title = 'Step count'
  svg += `<text x="${mx}" y="${my}" font-family="Arial" font-size="20" fill="${textColor}" >` + title + `</text>`

  const content: string[] = ['Mon', 'Wed', 'Fri']
  content.map((c, i) => {
    const fontSize = 12
    const x = mx
    const y = py + fontSize + i * 2 * (width + blank) + width + blank
    svg += `
        <text x="${x}" y="${y}" font-family="Arial" font-size="${fontSize}" fill="${textColor}" >${c}</text>
    `
  })

  let months = new Array(12)
  const currentMonth = new Date().getMonth()

  for (let i = 0; i < 12; i++) {
    let monthIndex = (currentMonth + i) % 12
    switch (monthIndex) {
      case 0:
        months[i] = 'Jan'
        break
      case 1:
        months[i] = 'Feb'
        break
      case 2:
        months[i] = 'Mar'
        break
      case 3:
        months[i] = 'Apr'
        break
      case 4:
        months[i] = 'May'
        break
      case 5:
        months[i] = 'Jun'
        break
      case 6:
        months[i] = 'Jul'
        break
      case 7:
        months[i] = 'Aug'
        break
      case 8:
        months[i] = 'Sep'
        break
      case 9:
        months[i] = 'Oct'
        break
      case 10:
        months[i] = 'Nov'
        break
      case 11:
        months[i] = 'Dec'
        break
    }
  }
  months.map((m, i) => {
    const x = px + ((width + blank) * i * 53) / 12
    const y = py - 2
    svg += `<text x="${x}" y="${y}" font-family="Arial" font-size="12" fill="${textColor}" >${m}</text>`
  })

  return <div dangerouslySetInnerHTML={{ __html: svg }} />
}

export default SampleSvg
