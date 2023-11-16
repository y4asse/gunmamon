// server内で使用
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export const getServerSession = async () => {
  const cookieStore = cookies()
  const token = cookieStore.get('session_token')
  if (!token) {
    return null
  }
  const value = token.value
  const data = jwt.decode(value) as { email: string }
  console.log(data)
  return data
}
