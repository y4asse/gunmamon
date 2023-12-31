import Person from '@/components/animation/Camping'
import React from 'react'

const Step = ({
  color,
  title,
  contents,
  width,
  height
}: {
  color: any
  title: any
  contents: any
  width: any
  height: any
}) => {
  const isImage = (url: any) => {
    const extension = url.split('.').pop().toLowerCase()
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
    return imageExtensions.includes(extension)
  }
  const imageStyle = {
    width: width ? `${width}px` : 'auto',
    height: height ? `${height}px` : 'auto',
    maxWidth: '100%',
    maxHeight: '100%'
  }

  const DOMs = contents.map((item: any, index: any) => (
    <React.Fragment key={index}>
      {!isImage(item) ? (
        <div className="m-2 font-normal">
          {item.split('<br>').map((sentence: any, index: any) => (
            <React.Fragment key={index}>
              {sentence}
              <br />
            </React.Fragment>
          ))}
        </div>
      ) : (
        <img src={item} className="m-2 mx-auto" style={imageStyle} />
      )}
      <br />
    </React.Fragment>
  ))

  return (
    <div className={`rounded-lg border p-2 bg-${color} mt-5 px-10`}>
      <div className="mb-4 font-bold text-4xl">{title}</div>
      <div className="m-2 font-normal">{DOMs}</div>
    </div>
  )
}

const About = ({ color, title, contents }: { color: string; title: string; contents: string }) => {
  return (
    <div className={`border-t border-side p-2 bg-${color} mt-12 px-20`}>
      <div className="mb-4 font-bold text-4xl text-center mt-5">
        <span className="text-indigo-500">{title}</span>とは...
      </div>
      <div className="m-2 font-normal text-center">
        {contents.split('<br>').map((sentence, index) => (
          <React.Fragment key={index}>
            {sentence}
            <br />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params
  return (
    <>
      <div className="text-center mt-10 flex justify-center items-center flex-wrap gap-3">
        <h1 className="text-2xl md:w-[50%] w-full font-bold mt-5">
          <span className="text-indigo-500">Git Active</span>はあなたの
          <br />
          運動不足解消をサポートします
        </h1>
        <div className="w-[300px] h-[300px] mx-auto pt-10 mt-5">
          <Person />
        </div>
      </div>
      <About
        color="blue-300"
        title="Git Active"
        contents="運動量を草で表すことで、日々の運動を可視化するアプリです。<br>GoogleFitとの連携により、歩いた分だけ草が生えます。"
      />
      <hr className="mt-10 text-indigo-500" />

      {/* GitHub用のURL */}
      <div className="mt-10 text-center">
        <Step
          color="blue-300"
          title="手順1"
          contents={[
            '[]の中身を埋めて、以下のURLにアクセスする。<br>https://high-wave-403814.an.r.appspot.com/?id=[あなたのUID]&color_type=[草の色]&bg_color_type=[背景の色]'
          ]}
          width="50"
          height="50"
        />
        <div className="m-2 font-bold">↓</div>
        <Step
          color="blue-200"
          title="手順2"
          contents={['草の画像が出てくることを確認する<br>↓サンプル', '../../../../../kusa.png']}
          width="300"
          height="100"
        />
        <div className="m-2 font-bold">↓</div>
        <Step
          color="blue-200"
          title="手順3"
          contents={['手順1のURLをimgタグに入れ、readmeに貼り付ける<br><img src=[URL] />']}
          width="50"
          height="50"
        />
        <div className="mb-5"></div>
      </div>
    </>
  )
}

export default Page
