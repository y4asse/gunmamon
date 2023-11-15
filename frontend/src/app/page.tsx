import Link from 'next/link'
import dynamic from 'next/dynamic'
// const LoginButton = dynamic(() => import('@/components/login/LoginButton'))
import LoginButton from '@/components/login/LoginButton'

export default function Home() {
  const redirect_uri = process.env.REDIRECT_URI
  const client_id = '171244859464-tmrgdbtp4c26j6u8s5pd71o36utcdjbq.apps.googleusercontent.com'
  const scope = 'https://www.googleapis.com/auth/fitness.activity.read'
  const response_type = 'code'
  const access_type = 'offline'
  const include_granted_scope = 'true'
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=${access_type}&include_granted_scope=${include_granted_scope}&response_type=${response_type}&redirect_uri=${redirect_uri}&client_id=${client_id}&prompt=consent`

  return (
    <main className=" text-center h-screen w-screen flex justify-center items-center bg-violet-300">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-end px-4 pt-4"></div>
        <div className="flex flex-col items-center pb-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6435D1" className="w-20 h-20 mt-12 mb-4">
            <path
              fill-rule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clip-rule="evenodd"
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

    // <div className="min-h-screen bg-pink pt-16">
    //   <div className="bg-[white] py-10 px-5 rounded-xl max-w-[400px] mx-auto">
    //     <div className="flex justify-center"></div>
    //     <p className="text-gray mt-10">ログインするとぐんまもんが使えるようになります。</p>
    //     <LoginButton googleAuthUrl={googleAuthUrl} />
    //     <hr className="mt-10 text-[#c2c2c2]" />
    //     <p className="text-gray mt-5">
    //       プライバシーポリシーについては
    //       <Link className="underline" href={'/about/privacy'}>
    //         こちら
    //       </Link>
    //       をご確認ください。このサイトの詳細については
    //       <Link className="underline" href={'/about'}>
    //         こちら
    //       </Link>
    //       をご覧ください。
    //     </p>
    //   </div>
    // </div>
  )
}
