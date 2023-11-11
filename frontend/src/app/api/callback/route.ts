import { GoogleOAuthResponse } from '@/types'
import { db } from '@/utils/db'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest, res: NextResponse) => {
  const code = req.nextUrl.searchParams.get('code')
  console.log(code)

  const grant_type = 'authorization_code'
  const redirect_uri = process.env.REDIRECT_URI
  const client_secret = process.env.CLIENT_SECRET
  const client_id = process.env.CLIENT_ID
  const scope = 'https://www.googleapis.com/auth/fitness.activity.read'
  const result = await fetch(`https://accounts.google.com/o/oauth2/token`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    cache: 'no-cache',
    body: `code=${code}&grant_type=${grant_type}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&client_id=${client_id}&scope=${scope}`
  })
  const GoogleOAuthResponse = (await result.json()) as GoogleOAuthResponse
  console.log(GoogleOAuthResponse)
  const user = await db.user.create({
    data: {
      refreshToken: GoogleOAuthResponse.refresh_token
    }
  })
  const { id } = user
  return redirect(`/${id}`)
}
