import { NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers';

export default function handleLogout(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // クッキーを削除する処理
    cookies().delete('session_token');
    res.status(200).json({ message: 'Logged out' });
  } else {
    res.status(405).end('Method Not Allowed');
  }
}