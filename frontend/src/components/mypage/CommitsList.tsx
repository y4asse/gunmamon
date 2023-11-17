import { Commit } from '@prisma/client'
import Fire from '../animation/Fire'

const CommitsList = ({ commits }: { commits: Commit[] }) => {
  if (commits.length === 0)
    return (
      <div>
        <h1 className="text-center text-2xl font-bold">まだコミットがありません</h1>
        <div className="w-[500px] mx-auto">
          <Fire />
        </div>
      </div>
    )
  return (
    <div>
      {commits.map((commit, i) => {
        const year = commit.createdAt.getFullYear()
        const month = commit.createdAt.getMonth() + 1
        const date = commit.createdAt.getDate()
        const time = commit.createdAt.getHours()
        const minitue = commit.createdAt.getMinutes()
        const showDate = `${year}/${month}/${date} ${time}:${minitue}`
        return (
          <div key={i}>
            {i != 0 && <div className="h-5 w-[5%] border-r-4 border-gray-400" />}
            <div>{showDate}</div>
            <div className="h-5 w-[5%] border-r-4 border-gray-400" />
            <div className="bg-white text-black rounded-xl py-3 px-5 pr-5 border-2 border-gray-300">
              <h2 className="text-xl font-bold">
                <span className="text-4xl mr-2">{commit.emoji}</span>
                {commit.title}
              </h2>
              <p className="text-gray-500 mt-3">{commit.message ? commit.message : ''}</p>
              <div className="mt-1 text-3xl text-right">
                {commit.minitue}
                <span className="text-gray-500 text-lg">min</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CommitsList
