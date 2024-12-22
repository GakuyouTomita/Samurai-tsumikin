import React, { useEffect, useState } from "react";
import { COUNT_CHECKPOINTS, getMessageForCount } from "../utils/messageManager";
import { useTotalCount } from '../utils/useTotalCount';
import { useRouter } from "next/router";


const Checkpoint = () => {
    const { fullTotalCount } = useTotalCount();
    const [clearCount, setClearCount] = useState(0);

    // "CLEAR"が表示された個数をカウント
    useEffect(() => {
        const count = COUNT_CHECKPOINTS.filter(count => count <= fullTotalCount).length;
        setClearCount(count);
    }, [fullTotalCount]);

    const lineHeight = clearCount * 57;

    const router = useRouter();
    const navigateToPage = (path: string) => {
        router.push(path);
    };

    return (
        <div className="flex justify-center bg-bg bg-fixed bg-cover h-screen overflow-y-auto">
            <div className="w-full max-w-[414px] bg-bgbg h-[1800px]">
            <div className="mt-24 mb-2 mx-4 text-xl font-bold text-center">CheckPoint List</div>

                <div className="flex justify-center">
                    <button
                        onClick={() => navigateToPage("/checkpoint")}
                        className="mt-8 ml-4 py-2 px-12 text-sm font-bold text-center text-black1 bg-white rounded-t-xl border-X border-t-black1 border-l-black1 border-r-black1 border-b-bgbg">
                        筋トレ時間
                    </button>
                    <button
                        className="mt-8 mr-4 px-12 text-sm font-bold text-center text-white bg-black1 rounded-t-xl border-X border-t-black1 border-l-black1 border-r-black1 border-b-black1">
                        筋トレ回数
                    </button>
                </div>

                <div className="bg-white mx-4 p-2 pt-4 h-[1400px] border-X border-black rounded-2xl shadow-X flex flex-col justify-between">
                    <div className="relative mx-2">
                        <div
                            className="absolute top-0 left-[29px] w-[4px] bg-black1 z-10"
                            style={{ height: `${lineHeight}px` }}
                        ></div>
                        <div className="absolute top-0 left-[29px] w-[4px] h-[1340px] bg-disable z-1"></div>

                        <table className="font-light justify-self-center w-full absolute z-20">
                            <thead>
                                <tr className="text-xs"></tr>
                            </thead>
                            <tbody>
                                {COUNT_CHECKPOINTS.map((count, index) => {
                                    const isClear = count <= fullTotalCount; 
                                    return (
                                        <tr key={index} className="h-14">
                                            {/* ●の位置とそのスタイル */}
                                            <td className="px-0 w-16 relative text-center">
                                                {isClear ? (
                                                    <span className="text-success text-xs font-bold bg-white border-2 border-success rounded-lg p-1">CLEAR!</span>
                                                ) : (
                                                    <span className="text-disable text-2xl">●</span>
                                                )}
                                            </td>
                                            {/* メッセージ部分のスタイル */}
                                            <td className={`px-2 py-2 text-xs ${isClear ? "text-success font-bold" : "text-disable"}`}>
                                                {getMessageForCount(count)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkpoint;
