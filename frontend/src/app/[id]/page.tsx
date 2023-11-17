import Person from '@/components/animation/Camping'
import React from 'react'

const Step = ({ color, title, content }: { color: any; title: any; content: any }) => {
  const contentLines = content.split('<br>')
  return (
    <div className={`rounded-lg border p-2 bg-${color} mt-5 px-10`}>
      <div className="mb-4 font-bold text-4xl">{title}</div>
      <div className="m-2 font-normal">
        {contentLines.map((line: any, index: any) => (
          <React.Fragment key={index}>
            {line}
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
        <h1 className="text-2xl md:w-[50%] w-full font-bold">
          <span className="text-yellow-200">ぐんまもん</span>はあなたの
          <br />
          運動不足解消をサポートしますwwwww
        </h1>
        <div className="w-[300px] h-[300px] mx-auto mt-5">
          <Person />
        </div>
      </div>

      <hr className="mt-10 text-yellow-200" />

      {/* GitHub用のURL */}
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-bold text-center ">あなたのURL</h1>
        <div className="shadow-xl p-5 rounded-xl whitespace-nowrap bg-gray-500 mt-2 mb-5 overflow-x-auto">{`![https://gunmamon.vercel.app](https://high-wave-403814.an.r.appspot.com?id=${id})`}</div>
        <div>
          <button className="rounded bg-indigo-500 py-1 px-4">コピーする</button>
        </div>
        <div>
          <Step color="blue-200" title="手順1" content="あああああああ<br>あああああ<br>あああああ<br>あああああ" />
          <div className="m-2 font-bold">↓</div>
          <Step color="blue-300" title="手順2" content="あああああああ<br>あああああ<br>あああああ<br>あああああ" />
          <div className="mb-5"></div>
        </div>
      </div>
    </>
  )
}

export default Page
