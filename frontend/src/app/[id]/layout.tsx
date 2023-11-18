import { getServerSession } from '@/utils/useSession'
import { notFound, redirect } from 'next/navigation'
import React from 'react'
import Tab from '@/components/mypage/Tab'
import { db } from '@/utils/db'
import Profile from '@/components/mypage/Profile'

const Layout = async ({ children, params }: { children: React.ReactNode; params: { id: string } }) => {
  const data = await getServerSession()
  if (!data) {
    return redirect('/')
  }
  const { id } = params
  // プロフィール情報を取得する処理を記述
  const user = await db.user.findUnique({
    where: { id: params.id }
  })
  // const user = {
  //   id: '6555e6241d4dd0926a7350bd',
  //   refreshToken:
  //     '1//0ea9VkITxeEPBCgYIARAAGA4SNwF-L9IrffI94C8yylxvbsuzrFcLccve5rtroW2WjPTSolBKRrzH_9dotHUSl6cd7u7nIQirbfU',
  //   email: 'yasse0218@gmail.com',
  //   picture: 'https://lh3.googleusercontent.com/a-/ALV-UjX0kN894CNP0W9gDTl8Me4jQ--dmA7J8oFmoycFMGKCmA=s96-c'
  // }
  if (!user) {
    return notFound()
  }
  console.log(user)

  if (data.email !== user.email) {
    return <div>invalid request</div>
  }

  if (user.picture === null) {
    user.picture = '' // null の場合、空文字列に変換するなどの処理を追加
  }

  return (
    <main className="bg-primary min-h-screen text-white ">
      <div className="">
        <div className="bg-indigo-400">
          <Tab id={params.id} user={user} />
        </div>
      </div>
      {/* profile */}
      <div className=" max-w-[900px] mx-auto mt-5 pb-10">
        {/*ProFile.tsxにコンポーネント化した部分 */}
        {/* <div className="flex justify-center items-center gap-5">
          <div>
            <img
              src={user.picture ? user.picture : ''}
              className="rounded-full w-20 h-20 mx-auto border border-[#a5a5a5]"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">User ID</h1>
            <p>{id}</p>
          </div>
        </div> */}
        {/* <Profile user={user} /> */}

        {children}
      </div>
    </main>
  )
}

export default Layout
