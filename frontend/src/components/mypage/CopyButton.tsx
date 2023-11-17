'use client'
import copy from 'clipboard-copy'
import { useState } from 'react'

const CopyButton = ({ copyText }: { copyText: string }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    copy(copyText).then(() => {
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 3000)
    })
  }

  return (
    <button
      disabled={isCopied}
      onClick={handleCopy}
      className="inline-flex items-center pl-7 pr-7 py-3 text-base font-medium text-center text-white bg-violet-700 rounded-lg hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-blue-800"
    >
      {isCopied ? 'Copied!' : 'Copy'}
    </button>
  )
}
export default CopyButton
