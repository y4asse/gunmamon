'use client'

import CopyButton from '@/components/mypage/CopyButton'
import CustomColor from '@/components/mypage/CustomColor'
import React, { useState } from 'react'

const Page = ({ params }: { params: { id: string; url: string } }) => {
  const { id } = params
  const [colorType, setColorType] = useState<string>('green')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [textColor, setTextColor] = useState('#000000')
  const url = `${process.env.NEXT_PUBLIC_API_URL}?id=${id}&color_type=${colorType}&bg_color=${bgColor}&text_color=${textColor}`
  const validUrl = url.replaceAll('#', '%23')
  const copyText = `![https://gunmamon.vercel.app](${validUrl})`
  const copyText2 = `![https://gunmamon.vercel.app](${validUrl}&type=commit)`

  return (
    <>
      {/* GitHub用のURL */}
      <CustomColor
        colorType={colorType}
        bgColor={bgColor}
        setColorType={setColorType}
        setBgColor={setBgColor}
        textColor={textColor}
        setTextColor={setTextColor}
      />
      <div className="mt-10 text-center bg-white p-5 rounded-xl shadow-xl border-2 border-gray-400 mb-20">
        <h1 className="text-2xl font-bold text-center text-black">GitHub用のURL</h1>
        <p className="text-black mt-3">(このテキストをGitHubに貼り付けるとREADMEに運動の草を生やすことができます)</p>
        <div className="border p-5 mt-5 rounded-xl">
          <h1 className="text-black text-xl  font-bold">歩数の草</h1>
          <div className="shadow-xl p-5 rounded-xl whitespace-nowrap bg-gray-500 mt-2 mb-7 overflow-x-auto">
            {copyText}
          </div>
          <div>
            <CopyButton copyText={copyText} />
          </div>
        </div>
        <div className="border p-5 mt-5 rounded-xl">
          <h1 className="text-black text-xl  font-bold">運動履歴の草</h1>
          <div className="shadow-xl p-5 rounded-xl whitespace-nowrap bg-gray-500 mt-2 mb-7 overflow-x-auto">
            {copyText2}
          </div>
          <div>
            <CopyButton copyText={copyText2} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
