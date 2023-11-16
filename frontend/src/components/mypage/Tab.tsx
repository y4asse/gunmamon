'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Tab = ({ id }: { id: string }) => {
  const tabs = [
    { name: 'ホーム', href: `/${id}` },
    { name: '記録する', href: `/${id}/commit` },
    { name: '草を観る', href: `/${id}/kusa` }
  ]
  const path = usePathname()
  console.log(path)
  return (
    <div className="border-b-2 border-white p-5 mt-5 flex gap-5">
      {tabs.map((item, i) => {
        return (
          <Link
            key={i}
            href={`${item.href}`}
            className={`text-white ${path === item.href ? 'text-yellow-300 -translate-y-1' : ''}`}
          >
            {item.name}
          </Link>
        )
      })}
      <Link href="/" className=" text-white">
        トップ
      </Link>
    </div>
  )
}

export default Tab
