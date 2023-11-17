'use server'

import { Inputs } from '@/components/mypage/CommitInput'
import { db } from '@/utils/db'

export async function ok(d: Inputs) {
  console.log(d)
}
export async function insert(d: Inputs, id: string, emoji: string) {
  console.log(d)
  const commit = await db.commit.create({
    data: {
      title: d.title,
      message: d.message,
      minitue: d.minitue,
      user_id: id,
      emoji: emoji
    }
  })
  console.log(commit)
  return commit
}
