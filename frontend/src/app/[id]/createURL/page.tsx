'use client'

import CopyButton from '@/components/mypage/CopyButton'
import CustomColor from '@/components/mypage/CustomColor'
import React, { useState } from 'react'
export const colorTypes = ['red', 'pink', 'orange', 'yellow', 'green', 'light-blue', 'blue', 'purple'] as const
export type Colors = (typeof colorTypes)[number]

const Page = ({ params }: { params: { id: string; url: string } }) => {
  const { id } = params
  const [colorType, setColorType] = useState<Colors>('green')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [textColor, setTextColor] = useState('#000000')
  const url = `${process.env.NEXT_PUBLIC_API_URL}?id=${id}&color_type=${colorType}&bg_color=${bgColor}&text_color=${textColor}`
  const validUrl = url.replaceAll('#', '%23')
  const copyText = `![https://gunmamon.vercel.app](${validUrl})`

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
        <div className="shadow-xl p-5 rounded-xl whitespace-nowrap bg-gray-500 mt-2 mb-7 overflow-x-auto">
          {copyText}
        </div>
        <div>
          <CopyButton copyText={copyText} />
        </div>
        {/* <div className="mt-10">TODO ここにGitHubに表示する説明を書く、、、</div> */}
      </div>
    </>
  )
}

export default Page
