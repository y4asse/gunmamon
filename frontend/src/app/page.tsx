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
    <main className=" text-center h-screen w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">ぐんまもんデラックス２</h1>
        <p>ログインするとぐんまもんが使えるようになります。</p>
        <LoginButton />
        <p className="text-gray">
          プライバシーポリシーについては
          <Link className="underline" href={'/about/privacy'}>
            こちら
          </Link>
          をご確認ください。
        </p>
        <p className="text-gray">
          このサイトの詳細については
          <Link className="underline" href={'/about'}>
            こちら
          </Link>
          をご覧ください。
        </p>
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
