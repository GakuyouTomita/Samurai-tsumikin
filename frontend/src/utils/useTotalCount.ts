// useTotalCount.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useTotalCount = () => {
  const [fullTotalCount, setFullTotalCount] = useState(0);

  useEffect(() => {
    const fetchFullTotalCount = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/record/count");
        const data = await response.json();
        console.log("レスポンスデータ:", data);
        if (data && Array.isArray(data) && data[0] && typeof data[0].count === "number") {
          setFullTotalCount(data[0].count);  // 配列の最初の要素からcountを取得
          console.log("データの総数:", data[0].count);
        } else {
          console.error("データの個数の取得に失敗しました");
        }
      } catch (error) {
        console.error("データの個数取得エラー:", error);
      }
    };
  

    fetchFullTotalCount();
  }, []);

  const calculateCount = (data: { duration: number }[]) => {
    const totalCount = data.reduce((total, record) => total + record.duration, 0);
    setFullTotalCount(totalCount);
  };

  return { fullTotalCount, setFullTotalCount };
};
