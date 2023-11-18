// Profile.tsx
import React from 'react'

interface ProfileProps {
  user: {
    id: string
    picture: string | null
  }
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="flex justify-center items-center gap-5 mr-7">
      <div>
        <img
          src={user.picture ? user.picture : ''}
          className="rounded-full w-12 h-12 mx-auto "
          alt="ユーザーアイコン"
        />
      </div>
      <div>
        <h1 className="text-xl font-bold">User ID</h1>
        <p>{user.id}</p>
      </div>
    </div>
  )
}

export default Profile
