import { GoogleOAuthResponse } from '@/types'
import { db } from '@/utils/db'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest, res: NextResponse) => {
  const code = req.nextUrl.searchParams.get('code')
  console.log(code)

  const grant_type = 'authorization_code'
  const redirect_uri = process.env.REDIRECT_URI
  const client_secret = process.env.CLIENT_SECRET
  const client_id = process.env.CLIENT_ID
  const scope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/fitness.activity.read'
  ]

  const result = await fetch(`https://accounts.google.com/o/oauth2/token`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    cache: 'no-cache',
    body: `code=${code}&grant_type=${grant_type}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&client_id=${client_id}&scope=${scope.join(
      '+'
    )}`
  })
  const GoogleOAuthResponse = (await result.json()) as GoogleOAuthResponse
  const { refresh_token, access_token, expires_in, id_token } = GoogleOAuthResponse

  //emailの取得
  const userInfo = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo`, {
    cache: 'no-cache',
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }).then(async (res) => (await res.json()) as { email: string; picture: string })
  console.log(GoogleOAuthResponse)
  const dbUser = await db.user.findUnique({
    where: {
      email: userInfo.email
    }
  })
  let id: null | string = null
  if (dbUser) {
    id = dbUser.id
  } else {
    const newUser = await db.user.create({
      data: {
        refreshToken: refresh_token,
        email: userInfo.email,
        picture: userInfo.picture
      }
    })
    id = newUser.id
  }
  return NextResponse.redirect(`${process.env.FRONT_URL}/${id}`, {
    status: 302,
    headers: {
      'Set-Cookie': `session_token=${id_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${expires_in}; Secure`
    }
  })
}
