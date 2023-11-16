import Person from '@/components/mypage/Camping'

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
      <div className="mt-14 text-center">
        <h1 className="text-2xl font-bold text-center mb-5 ">あなたのURL</h1>
        <div className="shadow-xl p-5 rounded-xl whitespace-nowrap bg-gray-400 my-5 overflow-x-auto">{`![https://gunmamon.vercel.app](https://high-wave-403814.an.r.appspot.com?id=${id})`}</div>
        <div>
          <button className="">コピーする</button>
        </div>
        <div className="mt-10">TODO ここにGitHubに表示する説明を書く、、、</div>
      </div>
    </>
  )
}

export default Page
