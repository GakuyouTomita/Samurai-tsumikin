// frontend/src/pages/memory.tsx
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import PopAnimation from '../components/PopAnimation';
import { getMessageForDuration, DURATION_CHECKPOINTS } from "../utils/messageManager";
import { getMessageForCount, COUNT_CHECKPOINTS } from "../utils/messageManager";
import { useTotalDuration } from '../utils/useTotalDuration';


import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,

} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);
ChartJS.register(ArcElement, Tooltip, Legend);




const MyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<{ trainingDate: string; bodyPart: string; duration: number; startTime: number; }[]>([]);
  const [totalDurations, setTotalDurations] = useState<{ [key: string]: number }>({});
  // const [fullTotalDuration, setFullTotalDuration] = useState(0);
  const [fullTotalCount, setFullTotalCount] = useState(0);
  const [latestRecord, setLatestRecord] = useState<{ bodyPart: string, trainingDate: string, startTime: string, duration: number } | null>(null);

  const { fullTotalDuration } = useTotalDuration();

  
  const router = useRouter();
  const navigateToPage = (path: string) => {
    router.push(path);
  };

  const bodyPartColors: { [key: string]: string } = {
    "肩/背中": "bg-kata",
    "胸筋": "bg-kyoukin",
    "腕": "bg-ude",
    "腹筋": "bg-fukkin",
    "下半身": "bg-kahanshin",
  };

  const bodyPartColorsChart: { [key: string]: string } = {
    "肩/背中": '#ec8b62',
    "胸筋": '#F6AB49',
    "腕": '#CBD69D',
    "腹筋": '#59CAB3',
    "下半身": '#EE9CAD',
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

  const message = getMessageForDuration(fullTotalDuration); // メッセージ取得


  const changeMonth = (direction: "prev" | "next"): void => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:3002/api/record/all");
      const fetchedData = Array.isArray(response.data) ? response.data : [];
      setRecords(fetchedData);
      calculateDurations(fetchedData);
      console.log("データの個数:", fetchedData.length);
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
    console.log("totalDuration:", totalDuration);
  };


  // useEffectでコンポーネントの初期化時に最新データを取得
  useEffect(() => {
    fetchRecords();
    fetchLatestRecord();
    fetchFullTotalCount();
  }, []);

  // 最新データが取得されるたびにlatestRecordの内容を確認
  useEffect(() => {
    console.log("最新記録:", latestRecord);
    console.log("fullTotalDuration:", fullTotalDuration);
  }, [latestRecord]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      axios
        .post("http://localhost:3002/auth/validate", null, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem("token");
          router.push("/");
        });
    }
  }, [router]);



  const getColorForDay = (day: number): string => {
    const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const record = records.find((rec) => rec.trainingDate === dateString);
    if (record && bodyPartColors[record.bodyPart]) {
      return bodyPartColors[record.bodyPart];
    }
    return "";
  };


  // チェックポイント（時間）
  const sortedCheckpoints = DURATION_CHECKPOINTS.sort((a, b) => a - b);
  // fullTotalDurationより大きい最初のチェックポイント
  const nextCheckpoint = sortedCheckpoints.find((checkpoint) => checkpoint > fullTotalDuration);
  // fullTotalDurationより小さい最初のチェックポイント
  const prevCheckpoint = [...sortedCheckpoints].reverse().find((checkpoint) => checkpoint <= fullTotalDuration);
  // Progressの横幅
  const checkpointLength = nextCheckpoint !== undefined && prevCheckpoint !== undefined
    ? nextCheckpoint - prevCheckpoint
    : 0;
  // Progressの進捗バー
  const progressLength = fullTotalDuration !== undefined && prevCheckpoint !== undefined
    ? fullTotalDuration - prevCheckpoint
    : 0;

  const getRemainingToNextCheckpoint = (fullTotalDuration: number): number | null => {
    return nextCheckpoint !== undefined ? nextCheckpoint - fullTotalDuration : null;
  };
  const remaining = getRemainingToNextCheckpoint(fullTotalDuration);
  console.log("remaining:", remaining);
  console.log("progressLength:", progressLength);
  console.log("checkpointLength:", checkpointLength);


  // チェックポイント（回数）
  const sortedCountCheckpoints = COUNT_CHECKPOINTS.sort((a, b) => a - b);
  // fullTotalCountより大きい最初のチェックポイント
  const nextCountCheckpoint = sortedCountCheckpoints.find((checkpoint) => checkpoint > fullTotalCount);
  // fullTotalCountより小さい最初のチェックポイント
  const prevCountCheckpoint = [...sortedCountCheckpoints].reverse().find((checkpoint) => checkpoint < fullTotalCount);

  // Progressの横幅
  const countCheckpointLength =
    nextCountCheckpoint !== undefined && prevCountCheckpoint !== undefined
      ? nextCountCheckpoint - prevCountCheckpoint
      : 0;
  // Progressの進捗バー
  const countProgressLength =
    fullTotalCount !== undefined && prevCountCheckpoint !== undefined
      ? fullTotalCount - prevCountCheckpoint
      : 0;
  // 次のチェックポイントまでの残り回数を算出
  const getRemainingToNextCountCheckpoint = (fullTotalCount: number): number | null => {
    return nextCountCheckpoint !== undefined ? nextCountCheckpoint - fullTotalCount : null;
  };

  // 実際の使用例
  const remainingCount = getRemainingToNextCountCheckpoint(fullTotalCount);

  const safeCountCheckpointLength = countCheckpointLength !== null ? countCheckpointLength : 0;
  console.log("FullTotalDuration:", fullTotalDuration);
  console.log("FullTotalCount:", fullTotalCount);
  console.log("remainingCount:", remainingCount); // 次のチェックポイントまでの残り回数
  console.log("countProgressLength:", countProgressLength); // 現在の進捗量
  console.log("safeCountCheckpointLength:", safeCountCheckpointLength); // チェックポイント間の幅

  // 任意の回数に対応するメッセージを取得
  const countMessage = getMessageForCount(fullTotalCount);





  /////////////////Chart.js/////////////////////////////////////////////
  const chartData = {
    labels: Object.keys(bodyPartColors),
    datasets: [{
      label: 'min',
      data: Object.keys(bodyPartColorsChart).map(bodyPart => totalDurations[bodyPart] || 0),
      backgroundColor: Object.values(bodyPartColorsChart),
      borderWidth: 3,
      borderColor: "#000000",
      borderRadius: 8,
    }],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 60,  // 上の余白
          bottom: 220,  // 下の余白
          left: 100,   // 左の余白
          right: 100   // 右の余白
        },
      },
    },
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
        },
      },
    },
    scales: {
      x: {
        border: {
          color: "#000000",
          width: 3,
        },
        grid: { // 罫線
          color: "rgba(200, 200, 200, 0.5)",
          lineWidth: 1,
          display: false,
        },
        ticks: { // 凡例
          color: "#000000",
          font: {
            size: 14,
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
    <div className="flex justify-center bg-bg bg-fixed bg-cover h-screen overflow-y-auto">
      <div className="flex justify-center w-full max-w-[414px] bg-bgbg h-[2000px]">

        <div className="w-full max-w-[414px] px-0 pt-24 justify-center text-center">

          <PopAnimation>
            <div className="w-[414px] justify-center">
              <div className="mt-4 text-xl font-bold mb-2 text-center">Latest Record</div>
              <div className="items-end">
                {latestRecord ? (
                  <div>
                    <div className="mx-2 grid grid-cols-3 grid-rows-[1fr,5fr]">
                      <div className="text-xs justify-self-center">筋トレ日</div>
                      <div className="text-xs justify-self-center">部位</div>
                      <div className="text-xs justify-self-center">時間</div>

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
          </PopAnimation>

          <PopAnimation>
            <div className="w-[414px] flex flex-col justify-between mt-4">
              <div className="mt-4 mb-1 text-xl font-bold text-center">Calender</div>
              <div className="h-[480px] mx-4 bg-white p-4 border-X border-black rounded-2xl shadow-X flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <button onClick={() => changeMonth("prev")} className="px-3 py-1 bg-button text-white text-xl border-X border-black shadow-B rounded-2xl button-osikomi">&lt;</button>
                  <span className="text-xl font-semibold">{`${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月`}</span>
                  <button onClick={() => changeMonth("next")} className="px-3 py-1 bg-button text-white text-xl border-X border-black shadow-B rounded-2xl button-osikomi">&gt;</button>
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
                  <div className="text-sm border-black border-X rounded-xl h-10 my-2 text-center pt-2 bg-kyoukin">胸筋</div>
                  <div className="text-sm border-black border-X rounded-xl h-10 my-2 text-center pt-2 bg-ude">腕</div>
                  <div className="text-sm border-black border-X rounded-xl h-10 my-2 text-center pt-2 bg-fukkin">腹筋</div>
                  <div className="text-sm border-black border-X rounded-xl h-10 my-2 text-center pt-2 bg-kahanshin">下半身</div>
                </div>
              </div>
            </div>
            <div className="justify-self-end mt-2">
              <button
                onClick={() => navigateToPage("/log")}
                className="border-black border-X text-white bg-button px-2 py-1 mx-4 text-xs font-medium rounded-lg shadow-B button-osikomi">すべての記録を見る</button>
            </div>
          </PopAnimation>


          <PopAnimation>
            <div className="w-[414px] mt-4 py-2 p-0">
              <h2 className="text-xl font-bold mb-2 text-center"></h2>
              <div className="mt-4 mb-1 text-xl font-bold text-center">CheckPoint</div>

              <div className="shadow-X bg-white border-black border-X pb-4 pt-4 px-4 mx-4 flex flex-col items-center rounded-2xl">

                {/* 累計筋トレ時間エリア */}
                <div className="w-full place-items-center">
                  <div className=" text-center text-bs font-bold mt-2">これまでの総筋トレ時間
                    <div className="text-center my-2 pb-2">
                      <span className="text-6xl">{`${fullTotalDuration}`}</span>
                      <span className="text-bs ml-1">分</span>
                    </div>
                  </div>

                  <div className="mt-2 mx-2">
                    <div className="relative bg-bgbg border-black border-X px-4 flex flex-col items-center rounded-2xl">
                      <div className="grid grid-rows-[2fr_1fr] w-[300px] h-full">
                        <div className="pt-2 flex place-items-center justify-center text-lg font-bold text-black">
                          {message}
                        </div>
                        <div className="pb-2 flex place-items-center justify-center text-sm font-bold text-black">
                          と同じくらいの時間筋トレしました！
                        </div>
                      </div>
                    </div>

                    <span className="flex justify-between place-items-end text-xs font-semibold mt-4">
                      <span className="flex justify-between text-xs font-medium text-gray-500">
                        <span>{prevCheckpoint !== undefined ? prevCheckpoint : '-'}</span>
                      </span>
                      <span>
                        <span className="text-bs">次のチェックポイントまであと</span>
                        <span className="text-lg"> {remaining} </span>
                        <span className="text-bs">分</span>
                      </span>
                      <span className="flex justify-between text-xs font-medium text-gray-500">
                        <span>{nextCheckpoint !== undefined ? nextCheckpoint : '-'}</span>
                      </span>
                    </span>

                    <div className="px-2">
                      <progress
                        className="w-full h-8 mb-4 rounded-full overflow-hidden bg-gray-100"
                        value={progressLength}
                        max={checkpointLength}
                      ></progress>
                    </div>

                  </div>


                  {/* 累計筋トレ回数エリア */}
                  <div className="w-full place-items-center mt-8">
                    <div className=" text-center text-bs font-bold mt-2">これまでの総筋トレ回数
                      <div className="text-center my-2 pb-2">
                        <span className="text-6xl">{`${records.length}`}</span>
                        <span className="text-bs ml-1">回</span>
                      </div>
                    </div>

                    <div className="mt-2 mx-2">
                      <div className="relative bg-bgbg border-black border-X px-4 flex flex-col items-center rounded-2xl">
                        <div className="grid grid-rows-[2fr_1fr] w-[300px] h-full">
                          <div className="pt-2 flex place-items-center justify-center text-lg font-bold text-black">
                            {countMessage}
                          </div>
                          <div className="pb-2 flex place-items-center justify-center text-sm font-bold text-black">
                            と同じくらいの回数筋トレしました！
                          </div>
                        </div>
                      </div>

                      <span className="flex justify-between place-items-end text-xs font-semibold mt-4">
                        <span className="flex justify-between text-xs font-medium text-gray-500">
                          <span>{prevCountCheckpoint !== undefined ? prevCountCheckpoint : '-'}</span>
                        </span>
                        <span>
                          <span className="text-bs">次のチェックポイントまであと</span>
                          <span className="text-lg"> {remainingCount} </span>
                          <span className="text-bs">回</span>
                        </span>
                        <span className="flex justify-between text-xs font-medium text-gray-500">
                          <span>{nextCountCheckpoint !== undefined ? nextCountCheckpoint : '-'}</span>
                        </span>
                      </span>

                      <div className="px-2">
                        <progress
                          className="w-full h-8 mb-4 rounded-full overflow-hidden bg-gray-100"
                          value={countProgressLength}
                          max={countCheckpointLength}
                        ></progress>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="justify-self-end">
              <button
                onClick={() => navigateToPage("/checkpoint")}
                className="border-black border-X text-white bg-button px-2 py-1 mx-4 text-xs font-medium rounded-lg shadow-B button-osikomi">すべてのチェックポイントを見る</button>
            </div>
          </PopAnimation>



          <PopAnimation>
            <div className="w-[414px] mt-4 py-2 p-0">
              <h2 className="text-xl font-bold mb-2 text-center">Analytics</h2>
              <div className="shadow-X bg-white border-black border-X pb-4 pt-4 mt-2 px-4 mx-4 flex flex-col items-center rounded-2xl">

                <div className="mt-4 text-xl font-bold text-center"></div>
                <div>
                  <div className=" place-items-center text-center text-bs font-bold">
                    部位別筋トレ時間
                  </div>
                  <div className="">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </PopAnimation >

        </div>
      </div>
    </div>

  );
};

export default MyCalendar;