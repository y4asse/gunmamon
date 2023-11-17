import CopyButton from '@/components/mypage/CopyButton'
import React from 'react'

const Page = async ({ params }: { params: { id: string; url: string } }) => {
  const { id } = params
  const url = `https://high-wave-403814.an.r.appspot.com?id=${id}`

  return (
    <>
      {/* GitHub用のURL */}
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-bold text-center mb-7">あなたのURL</h1>
        <div className="shadow-xl p-5 rounded-xl whitespace-nowrap bg-gray-500 mt-2 mb-7 overflow-x-auto">{`![https://gunmamon.vercel.app](https://high-wave-403814.an.r.appspot.com?id=${id})`}</div>
        <div>
          <CopyButton copyText={url} />
        </div>
        {/* <div className="mt-10">TODO ここにGitHubに表示する説明を書く、、、</div> */}
      </div>
    </>
  )
}

export default Page
