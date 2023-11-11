'use client'

import { useSearchParams } from 'next/navigation'
import React from 'react'

const Callback = () => {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  return <div>{code}</div>
}

export default Callback
