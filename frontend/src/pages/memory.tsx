// frontend/src/pages/memory.tsx
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);



const MyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<{ trainingDate: string; bodyPart: string; duration: number; startTime: number; }[]>([]);
  const [totalDurations, setTotalDurations] = useState<{ [key: string]: number }>({});
  const [fullTotalDuration, setFullTotalDuration] = useState(0);
  const [latestRecord, setLatestRecord] = useState<{ bodyPart: string, trainingDate: string, startTime: string, duration: number } | null>(null);



  const router = useRouter();
  const navigateToPage = (path: string) => {
    router.push(path);
  };

  const bodyPartColors: { [key: string]: string } = {
    "肩・背中": "bg-kata",
    "胸筋": "bg-kyoukin",
    "腕": "bg-ude",
    "腹筋": "bg-fukkin",
    "下半身": "bg-kahanshin",
  };

  const bodyPartColorsChart: { [key: string]: string } = {
    "肩・背中": '#F2C288',
    "胸筋": '#616F8C',
    "腕": '#A3B0D9',   
    "腹筋": '#F2A679',
    "下半身": '#D99E89',
  };

  const generateCalendar = (): (number | null)[][] => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDay = firstDay.getDay();

    const calendar: (number | null)[] = Array.from({ length: startDay }, () => null);
    for (let i = 1; i <= lastDate; i++) {
      calendar.push(i);
    }

    const rows: (number | null)[][] = [];
    while (calendar.length) {
      rows.push(calendar.splice(0, 7));
    }
    return rows;
  };



  const changeMonth = (direction: "prev" | "next"): void => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:3002/api/record");
      const fetchedData = Array.isArray(response.data) ? response.data : [];
      setRecords(fetchedData);
      calculateDurations(fetchedData);
    } catch (error) {
      console.error("筋トレデータの取得に失敗しました:", error);
      setRecords([]);
    }
  };

  const fetchLatestRecord = async () => {
    try {
      const response = await axios.get("http://localhost:3002/api/record/latest");
      console.log("レスポンスデータ:", response.data);
      console.log("チェック１");
      if (response.data && typeof response.data === "object" && "bodyPart" in response.data) {
        setLatestRecord(response.data);
        console.log("チェック２");
        console.log(latestRecord);
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        setLatestRecord(response.data[0]);
        console.log("チェック３");
        console.log(latestRecord);
      } else {
        setLatestRecord(null);
        console.log("チェック４");
        console.log(latestRecord);
      }
    } catch (error) {
      console.error("最新データの取得にエラーが発生しました:", error);
    }
  };


  const calculateDurations = (data: { bodyPart: string; duration: number }[]) => {
    const totals: { [key: string]: number } = {};
    let totalDuration = 0;
    data.forEach((record) => {
      if (totals[record.bodyPart]) {
        totals[record.bodyPart] += record.duration;
      } else {
        totals[record.bodyPart] = record.duration;
      }
      totalDuration += record.duration;
    });
    setTotalDurations(totals);
    setFullTotalDuration(totalDuration);
  };


  // useEffectでコンポーネントの初期化時に最新データを取得
  useEffect(() => {
    fetchRecords();
    fetchLatestRecord(); // 最新データを取得する
  }, []); // 空の依存配列で初回レンダリング時のみ実行

  // 最新データが取得されるたびにlatestRecordの内容を確認
  useEffect(() => {
    console.log("最新記録:", latestRecord);
  }, [latestRecord]); // latestRecordが更新されるたびに実行



  const getColorForDay = (day: number): string => {
    const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const record = records.find((rec) => rec.trainingDate === dateString);
    if (record && bodyPartColors[record.bodyPart]) {
      return bodyPartColors[record.bodyPart];
    }
    return "";
  };

  /////////////////Chart.js/////////////////////////////////////////////
  const chartData = {
    labels: Object.keys(bodyPartColors),
    datasets: [
      {
        label: 'min',
        data: Object.keys(bodyPartColorsChart).map(bodyPart => totalDurations[bodyPart] || 0),
        backgroundColor: Object.values(bodyPartColorsChart),
        borderWidth: 3,
        borderColor: "#000000",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        color: "#000",
        anchor: "start" as "start",
        align: "end" as "end",
        padding: -18,
        font: {
          size: 16,
        }
      },
    },
    scales: {
      x: {
        border: { // 軸線（axesline）
          color: "#000000",
          width: 2,
        },
        grid: { // 罫線
          color: "rgba(200, 200, 200, 0.5)",
          lineWidth: 1,
          display: false,
        },
        ticks: { //凡例
          color: "#000000",
          font: {
            size: 12,
          },
        },
      },
      y: {
        border: {
          color: "#000000",
          width: 2,
        },
        grid: {
          display: false,
        },
        title: {
          display: false,
        },
      },
    },
  };
  /////////////////Chart.js/////////////////////////////////////////////


  return (
    <div className="flex flex-col items-center h-full bg-bg py-20">

      <div className="w-[414px] mt-8 p-0">

        <div className="mt-4 text-xl font-bold mb-2 text-center">最新の筋トレ記録</div>
        <div className="items-end">
          {latestRecord ? (
            <div>
              <div className="mx-2 grid grid-cols-3 grid-rows-[1fr,3fr]">
                <div className="text-base justify-self-center">Date</div>
                <div className="text-base justify-self-center">BodyPart</div>
                <div className="text-base justify-self-center">Duration</div>

                <div className="bg-white text-xl font-bold rounded-2xl border-X border-black justify-self-center w-28 h-22 flex flex-col items-center justify-center shadow-X">
                  <span className="text-base">{latestRecord.trainingDate.split('-')[0]}</span>
                  <span className="text-2xl">{latestRecord.trainingDate.split('-').slice(1).join(' / ')}</span>
                </div>

                <div className={`text-center text-2xl font-semibold rounded-2xl border-X border-black justify-self-center items-center pt-8 w-28 h-22 shadow-X ${bodyPartColors[latestRecord.bodyPart]}`}>{latestRecord.bodyPart}</div>

                <div className="bg-white justify-self-center pb-2 rounded-2xl border-X border-black w-28 h-22 shadow-X">
                  <div className="pt-3 text-5xl font-base justify-self-center">{latestRecord.duration}</div>
                  <div className="text-s justify-self-center">min</div>
                </div>
              </div>

            </div>
          ) : (
            <p>データ取得中</p>
          )}
        </div>
      </div>


      <div>
        <div className="w-[414px]">
          <div className="mt-10 mb-2 text-xl font-bold text-center">日別記録</div>
        </div>
        <div className="h-[480px] mx-4 my-1 bg-white p-4 border-X border-black rounded-2xl shadow-X flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth("prev")} className="px-3 py-1 bg-gra-green text-black text-xl border-X border-black shadow-X rounded-2xl">&lt;</button>
            <span className="text-xl font-semibold">{`${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月`}</span>
            <button onClick={() => changeMonth("next")} className="px-3 py-1 bg-gra-green text-black text-xl border-X border-black shadow-X rounded-2xl">&gt;</button>
          </div>

          <div className="grid grid-cols-7 text-center text-sm font-medium mb-2">
            <div className="text-red-500">日</div>
            <div>月</div>
            <div>火</div>
            <div>水</div>
            <div>木</div>
            <div>金</div>
            <div className="text-blue-500">土</div>
          </div>

          {generateCalendar().map((week, index) => (
            <div key={index} className="grid grid-cols-7 gap-x-1 py-0.5">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`rounded-xl flex justify-center items-center py-2 cursor-pointer border-X border-black ${day ? "hover:bg-gray-200" : "text-transparent"} ${day && getColorForDay(day) ? getColorForDay(day) : ""}`}
                >
                  {day || ""}
                </div>
              ))}
            </div>
          ))}

          <div className="grid grid-cols-5 gap-2 mt-auto">
            <div className="text-sm border-black border-X rounded-xl h-10 my-2 text-center pt-2 bg-kata">肩/背中</div>
            <div className="text-sm border-black border-X rounded-xl h-10 my-2 text-center pt-2 bg-kyoukin text-white">胸筋</div>
            <div className="text-sm border-black border-X rounded-xl h-10 my-2 text-center pt-2 bg-ude">腕</div>
            <div className="text-sm border-black border-X rounded-xl h-10 my-2 text-center pt-2 bg-fukkin">腹筋</div>
            <div className="text-sm border-black border-X rounded-xl h-10 my-2 text-center pt-2 bg-kahanshin">下半身</div>
          </div>
        </div>



        <div className="justify-self-end">
          <button
            onClick={() => navigateToPage("/log")}
            className="border-black border-X justify-self-end text-black bg-gra-green px-4 py-1 my-1 mx-4 text-base text-bold rounded-xl shadow-X">すべての記録を見る</button>
        </div>
      </div>


      <div className="w-[414px] mt-8 py-2 p-0">
        <h2 className="text-xl font-bold mb-2 text-center">部位ごとの筋トレ時間（分）</h2>
        <div className="shadow-X bg-white border-black border-X pb-4 pt-16 px-4 mx-4 flex justify-center rounded-2xl">
          <Bar data={chartData} options={chartOptions}
          />
        </div>
      </div>
      <div className="w-[414px] py-4 p-0">
        <div className="text-lg font-bold mb-2 text-center">これまでの総筋トレ時間</div>
        <div className="items-end bg-white border-black border-X rounded-2xl p-2 mx-4 mb-10">
          <div className="text-4xl font-medium ml-2">
            {fullTotalDuration}
          </div>
        </div>
      </div>



    </div >

  );
};

export default MyCalendar;