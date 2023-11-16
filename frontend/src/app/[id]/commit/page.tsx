const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params
  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold text-center mb-5 ">運動を記録する</h1>
      <p>TODO 運動を記録できる</p>
    </div>
  )
}

export default Page
