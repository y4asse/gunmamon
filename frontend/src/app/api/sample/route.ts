import { db } from '@/utils/db'
import { NextRequest } from 'next/server'

export const GET = async (req: NextRequest, res: NextRequest) => {
  const result = await db.user.findMany({})
  return Response.json({ result })
}
