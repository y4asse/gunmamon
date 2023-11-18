'use client'
import React, { useEffect } from 'react';

const Page = () => {
  useEffect(() => {
    // サーバーサイドでクッキーを扱うAPIエンドポイントへのリクエストを行う
    const logout = async () => {
      await fetch('/api/logout', { method: 'POST' });
      // ログアウト後の処理（例：トップページへのリダイレクト）
        window.location.href = '/';
    };

    logout();
  }, []);

  return <div>Loading...</div>;
};

export default Page;