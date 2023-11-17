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
    <div className="flex justify-center items-center gap-5">
      <div>
        <img
          src={user.picture ? user.picture : ''}
          className="rounded-full w-20 h-20 mx-auto border border-[#a5a5a5]"
          alt="ユーザーアイコン"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold">ユーザーID</h1>
        <p>{user.id}</p>
      </div>
    </div>
  )
}

export default Profile
