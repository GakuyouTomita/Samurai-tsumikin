
// frontend/src/pages/record.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const bodyPartOptions = [
    { value: "肩・背中", label: "肩・背中", bgColor: "bg-kata" },
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

    useEffect(() => {
        if (selectedBodyPart && typeof selectedBodyPart === "string") {
            setBodyPart(selectedBodyPart);
        }
    }, [selectedBodyPart]);

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
            const response = await fetch("http://localhost:3002/api/record", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                mode: 'cors',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to save record: ${errorData.error}`);
            }

            alert("記録が保存されました！");
            router.push("/memory");
        } catch (error) {
            console.error("エラーが発生しました:", error);
            alert("記録の保存中にエラーが発生しました。");
        }
    };

    const baseformClasses =
        "w-full group relative inline-flex items-center justify-center overflow-hidden px-6 py-6 text-2xl text-black1 transition-all border border-2 border-black1";

    return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-start">
            <div className="pt-20 grid grid-cols-[3fr,1fr,3fr]  grid-rows-2">
                <div className="rounded-full bg-white my-2 h-10 w-10 justify-self-end border-X border-gray-400"></div>
                <div className="bg-black h-0.5 w-20 mt-6"></div>
                <div className="rounded-full bg-black my-2 h-10 w-10"></div>
                <div className="text-xs text-gray-400 font-bold  justify-self-end mx-2">部位</div>
                <div className=""></div>
                <div className="text-xs text-black font-bold  justify-self-start mx-2">詳細</div>
            </div>
            <h1 className="text-2xl font-bold">詳細記録</h1>
            <form onSubmit={handleSubmit} className="p-2">


                {/* Bodypart */}
                <div className="mb-6">
                    <label
                        htmlFor="bodypart"
                        className="block text-black1 font-bold mb-1"
                    >
                        BodyPart
                    </label>
                    <select
                        id="bodypart"
                        value={bodyPart}
                        onChange={(e) => setBodyPart(e.target.value)}
                        className={`${baseformClasses} ${bodyPartOptions.find(option => option.value === bodyPart)?.bgColor} text-black1 border-X border-black rounded-2xl shadow-X`}
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


                {/* Training Date */}
                <div className="mb-6 flex items-end space-x-2">
                    <div className="w-1/2">
                        <label htmlFor="year" className="block text-black1 font-bold mb-1">
                            Date
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


                {/* Duration (Hours) */}
                <div className="mb-6 space-x-4 flex items-end">
                    <div className="w-1/3">
                        <label htmlFor="hours" className="block text-black1 font-bold mb-1">
                            Start Time
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



                {/* Duration */}
                <div className="mb-4 space-x-4 flex items-end">
                    <div className="w-1/2">
                        <label
                            htmlFor="duration"
                            className="block text-black1 font-bold mb-1"
                        >
                            Duration
                        </label>
                        <input
                            type="number"
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className={`${baseformClasses} border-X border-black rounded-2xl shadow-X`}
                            min="1"
                        />
                    </div>
                    <div className="block text-black1 font-bold">分間</div>
                </div>

                <button
                    type="submit"
                    className={`${baseformClasses} bg-green1 text-black px-2 py-12 w-full font-bold mt-10 border-X border-black rounded-2xl shadow-X`}
                >
                    記録する
                </button>


            </form>
        </div>
    );
}


