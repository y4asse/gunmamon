'use client'

import React, { useState } from 'react';

const Goal: React.FC = () => {
    /* 状態管理 */
    const [goal, setGoal] = useState<number>(0);
    const [steps, setSteps] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [clear, setClear] = useState<boolean>(false);
    
    /* 目標歩数の状態管理関数 */
    const updateGoal = (newGoal: number) => {
        if (newGoal >= 0) {
            setGoal(newGoal);
            updateProgress(newGoal, steps);
            setError(null);
        } else {
            setError('目標歩数は0以上の値を入力してください。');
        }
    };

    /* 自分の歩数の状態管理関数 */

    const updateSteps = (newSteps: number) => {
        setSteps(newSteps);
        updateProgress(goal, newSteps);
    };

    /* 進捗の状態管理関数 */

    const updateProgress = (currentGoal: number, currentSteps: number) => {
        const newProgress: number = (currentSteps / currentGoal) * 100;
        console.log(`進捗: ${currentSteps} 歩 (${newProgress.toFixed(2)}%)`);
        if (newProgress >= 100) {
            setClear(true);
        } else {
            setClear(false);
        }
    };
    
    /* 状態管理の初期値 */
    const progress: number = (steps / goal) * 100;

    return (
    <div className="mt-5 text-black">
        <label className="mr-2 text-xl text-white">
            目標歩数：
        </label>
        <input
            className="mr-2 border rounded px-3 py-1"
            type="number"
            value={goal}
            onChange={(e) => updateGoal(parseInt(e.target.value, 10))}
        />
        <span className="text-xl mr-4 text-white">歩</span>
        <label className="text-xl text-white">
            今日の歩数：
        </label>
        <input
            className="mr-2 border rounded px-3 py-1"
            type="number"
            value={steps}
            onChange={(e) => updateSteps(parseInt(e.target.value, 10))}
        />
        <span className="text-xl mr-2 text-white">歩</span>
        <div className="my-2 text-xl text-white">
            <p className="py-1.5">目標: {goal} 歩</p>
            <p>進捗: {steps} 歩 ({progress.toFixed(2)}%)</p>
            {clear && (
            <div className="bg-green-500 text-white p-4 rounded my-3">
            おめでとうございます！目標達成しました！
            </div>
            )}
        </div>
    </div>
    );
};

export default Goal;
