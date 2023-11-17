"use client";
import { useState, useEffect } from 'react';
import { Commit } from '@prisma/client'
import Fire from '../animation/Fire'

const CommitsList = ({ commits }: { commits: Commit[] }) => {
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0)

  useEffect(() => {
    // コミットが変更されたときに週ごとと月ごとの合計を計算
    const currentWeek = getWeekNumber(new Date());
    const currentMonth = getMonthYear(new Date());

    const weeklySum = commits
      .filter((commit) => getWeekNumber(commit.createdAt) === currentWeek)
      .reduce((acc, commit) => acc + commit.minitue, 0);

    const monthlySum = commits
      .filter((commit) => getMonthYear(commit.createdAt) === currentMonth)
      .reduce((acc, commit) => acc + commit.minitue, 0);

    setWeeklyTotal(weeklySum);
    setMonthlyTotal(monthlySum);
  }, [commits]);
  const getWeekNumber = (date: Date) => {
    const dt = new Date(date);
    dt.setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() + 4 - (dt.getDay() || 7));
    const startOfYear = new Date(dt.getFullYear(), 0, 1);
    const weekNumber = Math.ceil((((dt.valueOf() - startOfYear.valueOf()) / 86400000) + 1) / 7);
    return weekNumber;
  };
  const getMonthYear = (date: Date) => {
    const dt = new Date(date);
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    return `${year}-${month}`;
  };

  if (commits.length === 0)
    return (
      <div>
        <h1 className="text-center text-2xl font-bold">まだコミットがありません</h1>
        <div className="w-[500px] mx-auto">
          <Fire />
        </div>
      </div>
    )
  return (
    <div>
       {/* 週ごとと月ごとの合計時間を表示 */}
      <div className="my-5 border-2 border-gray-300 p-4 rounded-lg text-center">
        <h1 className="text-3xl font-bold">週合計: {weeklyTotal} 分</h1>
        <h1 className="text-3xl font-bold">月合計: {monthlyTotal} 分</h1>
      </div>
      {commits.map((commit, i) => {
        const year = commit.createdAt.getFullYear()
        const month = commit.createdAt.getMonth() + 1
        const date = commit.createdAt.getDate()
        const time = commit.createdAt.getHours()
        const minitue = commit.createdAt.getMinutes()
        const showDate = `${year}/${month}/${date} ${time}:${minitue}`
        return (
          <div key={i}>
            {i != 0 && <div className="h-5 w-[5%] border-r-4 border-gray-400" />}
            <div>{showDate}</div>
            <div className="h-5 w-[5%] border-r-4 border-gray-400" />
            <div className="bg-white text-black rounded-xl py-3 px-5 pr-5 border-2 border-gray-300">
              <h2 className="text-xl font-bold">
                <span className="text-4xl mr-2">{commit.emoji}</span>
                {commit.title}
              </h2>
              <p className="text-gray-500 mt-3">{commit.message ? commit.message : ''}</p>
              <div className="mt-1 text-3xl text-right">
                {commit.minitue}
                <span className="text-gray-500 text-lg">min</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CommitsList
