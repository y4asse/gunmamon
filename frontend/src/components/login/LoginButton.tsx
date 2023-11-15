import { useRouter } from 'next/router'

const LoginButton = () => {
  const redirect_uri = process.env.REDIRECT_URI
  const client_id = '171244859464-tmrgdbtp4c26j6u8s5pd71o36utcdjbq.apps.googleusercontent.com'
  const scope = 'https://www.googleapis.com/auth/fitness.activity.read'
  const response_type = 'code'
  const access_type = 'offline'
  const include_granted_scope = 'true'
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=${access_type}&include_granted_scope=${include_granted_scope}&response_type=${response_type}&redirect_uri=${redirect_uri}&client_id=${client_id}&prompt=consent`

  return (
    <>
      <a
        href={googleAuthUrl}
        className="inline-flex items-center px-5 py-3 text-base font-medium text-center text-white bg-violet-700 rounded-lg
        hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 dark:bg-violet-600 dark:hover:bg-violet-700
        dark:focus:ring-blue-800"
      >
        Google認証
      </a>
    </>
  )
}

export default LoginButton
