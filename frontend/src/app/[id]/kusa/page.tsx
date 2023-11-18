import React from 'react'

const Kusa = ({ params }: { params: { id: string } }) => {
  const { id } = params
  return (
    <div className="mt-16 pb-36">
      <h1 className="text-center font-bold mb-5 text-xl">今日も１日お疲れ様です</h1>
      <h1 className="text-2xl font-bold text-center mt-5 mb-5">歩数の草</h1>
      <div className="mt-5 mb-9">
        <img className="mx-auto" src={`https://high-wave-403814.an.r.appspot.com?id=${id}`} />
      </div>
      <h1 className="text-2xl font-bold text-center mt-5 mb-5">運動履歴の草</h1>
      <div className="mt-5">
        <img className="mx-auto" src={`https://high-wave-403814.an.r.appspot.com?id=${id}&type=commit`} />
      </div>
    </div>
  )
}

export default Kusa
