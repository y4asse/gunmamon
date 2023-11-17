import CommitInput from '@/components/mypage/CommitInput'
import CommitsList from '@/components/mypage/CommitsList'
import { db } from '@/utils/db'

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params
  const commits = await db.commit.findMany({
    where: { user_id: id },
    orderBy: { createdAt: 'desc' }
  })
  return (
    <div className="my-10">
      <h1 className="text-2xl font-bold text-center mb-5 ">運動をコミット</h1>
      <CommitInput id={id} />
      <hr className="my-10" />
      <h1 className="text-2xl font-bold text-center mb-5 ">コミット履歴</h1>
      <CommitsList commits={commits} />
    </div>
  )
}

export default Page
