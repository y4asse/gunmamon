import { getServerSession } from '@/utils/useSession'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { db } from '@/utils/db'

const Layout = async ({ children, params }: { children: React.ReactNode; params: { id: string } }) => {
  const data = await getServerSession()
  if (!data) {
    return redirect('/')
  }
  const { id } = params
  const user = await db.user.findUnique({
    where: { id: id }
  })
  //   const user = {
  //     id: '6555e6241d4dd0926a7350bd',
  //     refreshToken:
  //       '1//0ea9VkITxeEPBCgYIARAAGA4SNwF-L9IrffI94C8yylxvbsuzrFcLccve5rtroW2WjPTSolBKRrzH_9dotHUSl6cd7u7nIQirbfU',
  //     email: 'yasse0218@gmail.com',
  //     picture: 'https://lh3.googleusercontent.com/a-/ALV-UjX0kN894CNP0W9gDTl8Me4jQ--dmA7J8oFmoycFMGKCmA=s96-c'
  //   }
  if (!user) {
    return notFound()
  }
  console.log(user)

  if (data.email !== user.email) {
    return <div>invalid request</div>
  }

  const tabs = [
    { name: 'ホーム', href: `/${id}` },
    { name: '記録する', href: `/${id}/commit` },
    { name: '草を観る', href: `/${id}/kusa` }
  ]
  return (
    <main className="bg-primary min-h-screen text-white px-2 py-10">
      {/* profile */}
      <div className=" max-w-[900px] mx-auto mt-5">
        <div className="flex justify-center items-center gap-5">
          <div>
            <img src={user.picture ? user.picture : ''} className="rounded-full w-20 h-20 mx-auto" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">User ID</h1>
            <p>{id}</p>
          </div>
        </div>
        <div className="border-b-2 border-white p-5 mt-10 flex gap-5">
          {tabs.map((item, i) => {
            return (
              <Link key={i} href={`${item.href}`} className="hover:text-yellow-300">
                {item.name}
              </Link>
            )
          })}
          <Link href="/" className=" text-white">
            トップ
          </Link>
        </div>
        {children}
      </div>
    </main>
  )
}

export default Layout
