export default function Home() {
  const redirect_uri = 'http://localhost:3000/callback'
  const client_id = '171244859464-tmrgdbtp4c26j6u8s5pd71o36utcdjbq.apps.googleusercontent.com'
  const scope = 'https://www.googleapis.com/auth/fitness.activity.read'
  const response_type = 'code'
  const access_type = 'offline'
  const include_granted_scope = 'true'
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=${access_type}&include_granted_scope=${include_granted_scope}&response_type=${response_type}&redirect_uri=${redirect_uri}&client_id=${client_id}`

  return (
    <main className="">
      <h1 className="text-3xl">ずんだもんデラックス２</h1>
      <a href={googleAuthUrl}>Google認証</a>
    </main>
  )
}
