// useTotalDuration.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useTotalDuration = () => {
  const [fullTotalDuration, setFullTotalDuration] = useState(0);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/record/all");
        const fetchedData = Array.isArray(response.data) ? response.data : [];
        calculateDurations(fetchedData);
      } catch (error) {
        console.error("筋トレデータの取得に失敗しました:", error);
      }
    };

    fetchRecords();
  }, []);

  const calculateDurations = (data: { duration: number }[]) => {
    const totalDuration = data.reduce((total, record) => total + record.duration, 0);
    setFullTotalDuration(totalDuration);
  };

  return { fullTotalDuration, setFullTotalDuration };
};
