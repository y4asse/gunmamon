import { cookies } from 'next/headers'

export async function POST() {
  // クッキーを削除する処理
  cookies().delete('session_token')
  return Response.json({ message: 'Logged out' })
}
