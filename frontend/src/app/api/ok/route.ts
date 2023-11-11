import { NextRequest } from 'next/server'

export const GET = async (req: NextRequest, res: NextRequest) => {
  return Response.json({ message: 'ok' })
}
