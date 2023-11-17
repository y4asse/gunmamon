'use client'

import { HexColorPicker } from 'react-colorful'
import SampleSvg from '../data/SampleSvg'
import { useState } from 'react'

const CustomColor = ({
  colorType,
  bgColor,
  textColor,
  setColorType,
  setBgColor,
  setTextColor
}: {
  colorType: string
  bgColor: string
  textColor: string
  setColorType: React.Dispatch<React.SetStateAction<string>>
  setBgColor: React.Dispatch<React.SetStateAction<string>>
  setTextColor: React.Dispatch<React.SetStateAction<string>>
}) => {
  const tabList = [
    { name: '草の色', state: 'glass' },
    { name: '文字色', state: 'text' },
    { name: '背景色', state: 'bg' }
  ]
  const colorTypes = ['red', 'pink', 'orange', 'yellow', 'green', 'light-blue', 'blue', 'purple'] as const
  const selectColor = (color: string) => {
    switch (color) {
      case 'red':
        return '#e05d44'
      case 'pink':
        return '#ff75b5'
      case 'orange':
        return '#ffa657'
      case 'yellow':
        return '#ffd33d'
      case 'green':
        return '#22863a'
      case 'light-blue':
        return '#79c0ff'
      case 'blue':
        return '#005cc5'
      case 'purple':
        return '#6f42c1'
    }
  }
  const [state, setState] = useState('glass')
  return (
    <>
      <div className="rounded-xl overflow-hidden ">
        <h1 className="text-2xl text-center font-bold py-5">あなただけの草にカスタマイズしましょう</h1>
        <div className="flex justify-center">
          <SampleSvg colorType={colorType} bgColor={bgColor} textColor={textColor} />
        </div>
      </div>

      <hr className="mt-10" />

      <div className="flex px-10 mt-5 text-xl text-center text-black font-bold justify-evenly  py-2">
        {tabList.map((tab) => (
          <button
            key={tab.state}
            className={`bg-white rounded-xl border-2 border-gray-400 py-1 px-5 ${
              tab.state === state && 'text-white bg-[#888888]'
            }`}
            onClick={() => setState(tab.state)}
          >
            {tab.name}を変更
          </button>
        ))}
      </div>

      {/* 草の色 */}
      {state === 'glass' && (
        <div className="flex justify-evenly rounded-xl flex-wrap gap-3 py-10">
          {colorTypes.map((color) => (
            <div
              onClick={() => setColorType(color)}
              role="button"
              key={color}
              style={{ backgroundColor: selectColor(color) }}
              className={`border border-gray-400 p-5 rounded-xl w-[200px] h-[100px] flex justify-center items-center ${
                colorType === color && 'ring-4 ring-black'
              }}`}
            >
              {color}
            </div>
          ))}
        </div>
      )}

      {/* 文字色 */}
      {state === 'text' && (
        <div className="flex justify-evenly py-10">
          <div className="bg-white rounded-xl border-2 border-gray-400">
            <HexColorPicker className="mx-auto" color={textColor} onChange={setTextColor} />
          </div>
        </div>
      )}

      {/* 背景色 */}
      {state === 'bg' && (
        <div className="flex justify-evenly py-10">
          <div className="bg-white rounded-xl border-2 border-gray-400">
            <HexColorPicker className="mx-auto" color={bgColor} onChange={setBgColor} />
          </div>
        </div>
      )}
    </>
  )
}

export default CustomColor
