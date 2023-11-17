'use client'

import { insert } from '@/app/action'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Picker, { EmojiClickData } from 'emoji-picker-react'
import { use, useRef, useState, useEffect } from 'react'
import Check from '../animation/Check'

export type Inputs = {
  title: string
  message?: string
  minitue: number
}

const CommitInput = ({ id }: { id: string }) => {
  const ref = useRef<HTMLDialogElement>(null)
  const [emojiData, setEmojiData] = useState<any>({
    activeSkinTone: 'neutral',
    emoji: '💪',
    names: [''],
    originalUnified: '',
    unified: ''
  })
  const [isOpenPicker, setIsOpenPicker] = useState<boolean>(false)

  // 絵文字ピッカーの枠外をクリックしたら閉じる
  const useOutsideClick = (ref, callback) => {
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          callback()
        }
      }
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [ref, callback]);
  }
  const pickerRef = useRef();

  useOutsideClick(pickerRef, () => {
    if(isOpenPicker) setIsOpenPicker(false);
  });

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setEmojiData(emoji)
    setIsOpenPicker(false)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Inputs>()
  const router = useRouter()
  return (
    <>
      <dialog
        className=" backdrop:bg-black backdrop:opacity-50 p-10 rounded-xl text-center"
        ref={ref}
        onClick={() => ref.current?.close()}
      >
        <h1 className="text-xl font-bold">
          運動お疲れ様です。この調子で続けましょう！
          <div className="w-[300px] mx-auto">
            <Check />
          </div>
        </h1>
        <button onClick={() => ref.current?.close()}>閉じる</button>
      </dialog>

      <form
        className="text-black"
        onSubmit={handleSubmit(async (d) => {
          await insert(d, id, emojiData.emoji)
          router.refresh()
          reset()
          ref.current?.showModal()
        })}
      >
        <div
          role="button"
          aria-label="change emoji button"
          className="text-center border-2 border-gray-300 w-[200px] rounded-xl overflow-hidden mx-auto bg-white"
          onClick={() => setIsOpenPicker(!isOpenPicker)}
        >
          <span className="text-[100px]">{emojiData.emoji}</span>
          <p className="bg-gray-100 py-1">絵文字を変更</p>
        </div>
        <div ref={pickerRef}>
        {isOpenPicker && (
          <div className="absolute right-1/2 translate-x-1/2 mt-5">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        </div>
        <div className="">
          <label className="text-xl text-white p-1">タイトル</label>
          <input
            type="text"
            className="border rounded p-3 w-full outline-indigo-300"
            {...register('title', { required: 'タイトルを入力してください' })}
            placeholder="タイトルを入力..."
          />
          {errors.title?.message && <p className="text-[red]">{errors.title?.message}</p>}
        </div>

        <div className="mt-5">
          <div>
            <label className="text-xl text-white p-1">時間</label>
          </div>
          <input
            className="border rounded px-3 py-1"
            type="number"
            min={0}
            {...register('minitue', { valueAsNumber: true, required: 'コミット時間を入力してください' })}
            defaultValue={0}
          />
          <span className="text-white text-xl ml-3">分</span>
          {errors.minitue?.message && <p className="text-[red]">{errors.minitue?.message}</p>}
        </div>
        <div className="mt-10">
          <label className="text-xl text-white p-1">コミットメッセージ</label>
          <textarea
            rows={3}
            className="border rounded px-3 py-1 w-full outline-indigo-300"
            {...register('message')}
            placeholder="コミットメッセージを入力..."
          />
        </div>
        <div className="mt-10 text-right ">
          <input
            type="submit"
            value="コミット"
            className="cursor-pointer text-xl bg-yellow-400 text-white font-bold py-1 px-5 rounded"
          />
        </div>
      </form>
    </>
  )
}

export default CommitInput
