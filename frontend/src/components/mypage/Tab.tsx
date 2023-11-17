'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Profile from '@/components/mypage/Profile'

interface TabProps {
  id: string
  user: {
    // ユーザー情報の型定義
    id: string
    picture: string | null
  }
}

const Tab: React.FC<TabProps> = ({ id, user }) => {
  const tabs = [
    { name: 'ホーム', href: `/${id}` },
    { name: 'URL作成', href: `/${id}/createURL` },
    { name: '記録する', href: `/${id}/commit` },
    { name: '草を観る', href: `/${id}/kusa` }
  ]
  const path = usePathname()
  return (
    <div className="p-5 mt-5 flex gap-5">
      {tabs.map((item, i) => {
        return (
          <Link key={i} href={`${item.href}`} className={`text-white ${path === item.href ? 'text-purple-500' : ''}`}>
            {item.name}
          </Link>
        )
      })}
      <Link href={`/${id}/logout`} className=" text-white">
        ログアウト
      </Link>
      <Profile user={user} />
    </div>
  )
}

export default Tab
