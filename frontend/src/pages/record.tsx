
// frontend/src/pages/record.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PopAnimation from '../components/PopAnimation';


const bodyPartOptions = [
    { value: "肩/背中", label: "肩/背中", bgColor: "bg-kata" },
    { value: "胸筋", label: "胸筋", bgColor: "bg-kyoukin" },
    { value: "腕", label: "腕", bgColor: "bg-ude" },
    { value: "腹筋", label: "腹筋", bgColor: "bg-fukkin" },
    { value: "下半身", label: "下半身", bgColor: "bg-kahanshin" },
];

export default function RecordPage() {
    const router = useRouter();
    const { bodypart: selectedBodyPart } = router.query;

    const [bodyPart, setBodyPart] = useState<string>("");
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number>(1);
    const [day, setDay] = useState<number>(1);
    const [hours, setHours] = useState<number>(0); // 時間
    const [minutes, setMinutes] = useState<number>(0); // 分
    const [duration, setDuration] = useState<number>(0); // 分

    // モーダル
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<{
        message: string;
        bodyPart: string;
        // daysSinceLast: number | null;
        // totalRecords: number;
    } | null>(null);



    useEffect(() => {
        console.log("Selected BodyPart:", selectedBodyPart);
        if (selectedBodyPart && typeof selectedBodyPart === "string") {
            setBodyPart(selectedBodyPart);
        }
    }, [selectedBodyPart]);

    // modalData が変更されるたびに出力
    useEffect(() => {
        console.log("Updated modalData:", modalData);
    }, [modalData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //日付をyyyy-mm-dd形式にする
        const trainingDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        // API に送信するデータ
        const data = {
            bodyPart,
            trainingDate,
            startTime: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
            duration,
        };
        console.log(data);


        try {
            const response = await fetch("http://localhost:3002/api/save",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                    mode: 'cors',
                });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to save record(fetch "3002/api/save"): ${errorData.error}`);
            }

            // 記録保存後、部位データを取得
            // const statusResponse = await fetch(`http://localhost:3002/api/record/status?bodyPart=${bodyPart}&trainingDate=${trainingDate}`);
            // console.log("api/record/statusから取得した部位データ", bodyPart);
            // if (!statusResponse.ok) {
            //     throw new Error("Failed to fetch(`3002/api/record/status?bodyPart&trainingDate");
            // }
            // const status = await statusResponse.json();


            // const daysSinceLast = status.daysSinceLast ?? 1;
            // const totalRecords = status.totalRecords ?? 1;

            setModalData({
                message: "筋トレを登録しました！",
                bodyPart,
                //     daysSinceLast: daysSinceLast,
                //     totalRecords: totalRecords,
            });
            setShowModal(true);
            // console.log("APIレスポンス", status);
            // console.log("daysSinceLast:", status.daysSinceLast);
            // console.log("totalRecords:", status.totalRecords);

        } catch (error) {
            console.error("記録保存はできたがエラーが発生しました:", error);
            alert("記録の保存中にエラーが発生しました。");
        }
    };

    const baseformClasses =
        "w-full group relative inline-flex items-center justify-center overflow-hidden px-2 py-6 text-2xl text-center text-black1 transition-all border border-2 border-black1";

    return (
        <div className="flex justify-center bg-bg bg-fixed bg-cover h-screen overflow-y-auto">
            <div className="flex flex-col items-center justify-start w-full max-w-[414px] bg-bgbg h-[1000px] bg-fixed">
                <div className="text-xl font-bold text-black1 text-center bg-white border-black border-X py-8 px-24 mt-24 my-8 flex-col rounded-2xl">
                    くわしく教えて！
                </div>

                <form onSubmit={handleSubmit} className="p-2">
                    <PopAnimation>
                        {/* Bodypart */}
                        <div className="mb-6 px-2">
                            <label
                                htmlFor="bodypart"
                                className="block text-black1 font-bold mb-1"
                            >
                                部位
                            </label>
                            <select
                                id="bodypart"
                                value={bodyPart}
                                onChange={(e) => setBodyPart(e.target.value)}
                                className={`${baseformClasses} ${bodyPartOptions.find(option => option.value === bodyPart)?.bgColor} font-bold text-black1 border-X border-black rounded-2xl shadow-X`}
                            >
                                {bodyPartOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                        className={option.bgColor}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </PopAnimation>


                    {/* Training Date */}
                    <PopAnimation>
                        <div className="mb-6  px-2 flex items-end space-x-2">
                            <div className="w-1/2">
                                <label htmlFor="year" className="block text-black1 font-bold mb-1">
                                    日付
                                </label>
                                <select
                                    id="year"
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className={`${baseformClasses} border-X border-black rounded-2xl shadow-X`}
                                >
                                    {[2024, 2025, 2026].map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="block text-black1 font-bold">年</div>

                            <div className="w-1/3">
                                <label htmlFor="month" className="block text-black1 font-bold mb-1">
                                </label>
                                <select
                                    id="month"
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    className={`${baseformClasses} border-X border-black rounded-2xl shadow-X`}
                                >
                                    {[...Array(12)].map((_, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="block text-black1 font-bold">月</div>


                            <div className="w-1/3">
                                <label htmlFor="day" className="block text-black1 font-bold mb-1">
                                </label>
                                <select
                                    id="day"
                                    value={day}
                                    onChange={(e) => setDay(Number(e.target.value))}
                                    className={`${baseformClasses} border-X border-black rounded-2xl shadow-X`}
                                >
                                    {[...Array(31)].map((_, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="block text-black1 font-bold">日</div>
                        </div>
                    </PopAnimation>


                    {/* StartTime */}
                    <PopAnimation>
                        <div className="mb-6 px-2 space-x-4 flex items-end">
                            <div className="w-1/3">
                                <label htmlFor="hours" className="block text-black1 font-bold mb-1">
                                    開始時間
                                </label>
                                <select
                                    id="hours"
                                    value={hours}
                                    onChange={(e) => setHours(Number(e.target.value))}
                                    className={`${baseformClasses} border-X border-black rounded-2xl shadow-X`}
                                >
                                    {[...Array(24).keys()].map((hour) => (
                                        <option key={hour} value={hour}>
                                            {hour}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="block text-black1 font-bold">時</div>

                            <div className="w-1/3">
                                <label htmlFor="minutes" className="block text-black1 font-bold mb-2">

                                </label>
                                <select
                                    id="minutes"
                                    value={minutes}
                                    onChange={(e) => setMinutes(Number(e.target.value))}
                                    className={`${baseformClasses} border-X border-black rounded-2xl shadow-X`}
                                >
                                    {[...Array(60).keys()].map((minute) => (
                                        <option key={minute} value={minute}>
                                            {minute}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="block text-black1 font-bold">分</div>
                        </div>
                    </PopAnimation>




                    {/* Duration */}
                    <PopAnimation>
                        <div className="mb-4 px-2 space-x-4 flex items-end">
                            <div className="w-1/2">
                                <label
                                    htmlFor="duration"
                                    className="block text-black1 font-bold mb-1"
                                >
                                    筋トレ時間
                                </label>
                                <input
                                    type="number"
                                    id="duration"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className={`${baseformClasses} border-X border-black rounded-2xl shadow-X text-center text-2xl`}
                                    min="1"
                                />
                            </div>
                            <div className="block text-black1 font-bold">分間</div>
                        </div>
                    </PopAnimation>

                    <PopAnimation>
                        <button
                            type="submit"
                            className={`${baseformClasses} text-white px-2 py-12 font-bold mt-10 border-X border-black rounded-2xl shadow-B button-osikomi bg-button`}
                        >
                            記録する
                        </button>
                    </PopAnimation>

                </form>


                {/* モーダルウィンドウ */}
                {showModal && modalData && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                        <div className="bg-white p-12 text-center border-X border-black rounded-2xl shadow-X">
                            <h2 className="text-xl font-bold mb-4">{modalData.message}</h2>
                            <p className={`text-2xl font-bold mb-2 px-2 border-X border-black1 rounded-2xl w-[160px] ${baseformClasses} ${bodyPartOptions.find(option => option.value === modalData.bodyPart)?.bgColor}`}>
                                {modalData.bodyPart}
                            </p>

                            {/* {modalData.daysSinceLast !== null && modalData.totalRecords > 0 && (
                            <p className="text-lg mb-2">
                                {modalData.daysSinceLast}日振り{modalData.totalRecords}回目
                            </p>
                        )} */}
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    router.push("/memory");
                                }}
                                className={`bg-button text-white w-full font-bold mt-10 py-4 text-2xl border-X border-black rounded-2xl shadow-B button-osikomi`}
                            >
                                振り返る
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


