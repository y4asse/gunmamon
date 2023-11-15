import Link from 'next/link'
import LoginButton from '@/components/login/LoginButton'

export default function Home() {
  return (
    <main className=" text-center h-screen w-screen flex justify-center items-center bg-violet-300">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-end px-4 pt-4"></div>
        <div className="flex flex-col items-center pb-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6435D1" className="w-20 h-20 mt-12 mb-4">
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>

          <h5 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">ぐんまもんデラックス２</h5>
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            ログインするとぐんまもんが使えるようになります。
          </span>
          <LoginButton />
          <span className="mt-6 mb-7">
            <p className="mb-1 text-sm text-gray dark:text-white mt-3">
              プライバシーポリシーについては
              <Link className="underline" href={'/about/privacy'}>
                こちら
              </Link>
              をご確認ください。
            </p>
            <p className="mb-1 text-sm text-gray dark:text-white">
              このサイトの詳細については
              <Link className="underline" href={'/about'}>
                こちら
              </Link>
              をご覧ください。
            </p>
          </span>
        </div>
      </div>
    </main>
  )
}
