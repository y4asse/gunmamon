import React from 'react'

const Kusa = ({ params }: { params: { id: string } }) => {
  const { id } = params
  return (
    <div className="mt-10">
      <h1 className="text-center">今日も一日お疲れ様です</h1>
      <h1 className="text-2xl font-bold text-center mt-5 ">歩数の草</h1>
      <div className="mt-5">
        <img className="mx-auto" src={`https://high-wave-403814.an.r.appspot.com?id=${id}`} />
      </div>
    </div>
  )
}

export default Kusa
