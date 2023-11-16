import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export const GET = async (req: NextRequest, res: NextResponse) => {
  const token = req.cookies.get('session_token')
  if (!token) {
    return NextResponse.redirect(`${process.env.FRONT_URL}`)
  }
  const value = token.value
  const decoded = jwt.decode(value)
  console.log(decoded)
  return NextResponse.json(decoded)
}
