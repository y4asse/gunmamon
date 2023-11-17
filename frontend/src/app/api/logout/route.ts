import { NextApiRequest, NextApiResponse } from 'next'
import { cookies } from 'next/headers'

export function POST(req: NextApiRequest, res: NextApiResponse) {
  // クッキーを削除する処理
  cookies().delete('session_token')
  return Response.json({ message: 'Logged out' })
}
