import { db } from '@/utils/db'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from '@/utils/useSession'

const Page = async ({ params }: { params: { id: string } }) => {
  const data = await getServerSession()
  if (!data) {
    return redirect('/')
  }

  const { id } = params
  const user = await db.user.findUnique({
    where: { id: id }
  })
  if (!user) {
    return notFound()
  }
  console.log(user)

  if (data.email !== user.email) {
    return notFound()
  }
  return <div>{id}</div>
}

export default Page
