import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Record {
    id: number;
    bodyPart: string;
    duration: number;
    trainingDate: string;
    startTime: string;
}

const Log: React.FC = () => {
    const [records, setRecords] = useState<Record[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<Set<number>>(new Set());
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [deletedCount, setDeletedCount] = useState<number>(0);

    const fetchRecords = async () => {
        try {
            const response = await axios.get("http://localhost:3002/api/record/all");
            setRecords(response.data);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleDelete = async () => {
        if (selectedRecords.size > 0) {
            try {
                const idsToDelete = Array.from(selectedRecords);
                await Promise.all(idsToDelete.map(id => axios.delete(`http://localhost:3002/api/record/${id}`)));
                await fetchRecords();
                // 削除された件数をセット

                setDeletedCount(idsToDelete.length);
                // 状態のリセット
                setSelectedRecords(new Set());
                setShowDeleteModal(false);
                setShowSuccessModal(true);
            } catch (error) {
                console.error('Error deleting records:', error);
            }
        }
    };

    const toggleSelectRecord = (id: number, index: number, shiftKey: boolean) => {
        const newSelectedRecords = new Set(selectedRecords);

        if (shiftKey && lastSelectedIndex !== null) {
            // Shiftキーが押されている場合の範囲選択
            const start = Math.min(lastSelectedIndex, index);
            const end = Math.max(lastSelectedIndex, index);

            for (let i = start; i <= end; i++) {
                newSelectedRecords.add(records[i].id);
            }
        } else {
            if (newSelectedRecords.has(id)) {
                newSelectedRecords.delete(id);
            } else {
                newSelectedRecords.add(id);
            }
        }

        setSelectedRecords(newSelectedRecords);
        setLastSelectedIndex(index);
    };
    const handleRowClick = (id: number, index: number, e: React.MouseEvent) => {
        if (e.target instanceof HTMLTableRowElement || e.target instanceof HTMLTableCellElement) {
            const shiftKey = e.shiftKey;
            toggleSelectRecord(id, index, shiftKey);
        }
    };


    return (
        <div className="flex justify-center bg-bg bg-fixed bg-cover h-screen overflow-y-auto">
            <div className="flex justify-center w-full max-w-[414px] bg-bgbg" style={{ minHeight: `${200 + (records.length * 50)}px` }}>
                <div className="w-[414px]">
                    <div className="mt-24 mb-2  mx-4 text-xl font-bold text-left">すべての記録</div>

                    <div className="my-2 justify-self-end">
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={selectedRecords.size === 0}
                            className={`border-X border-black rounded-xl shadow-B px-3 py-1 mx-4 mb-2 text-sm font-bold text-white button-osikomi ${selectedRecords.size > 0 ? "bg-button" : "bg-gray-200 text-gray-600 border-none"
                                }`}
                        >
                            選択したツミログを削除
                        </button>
                    </div>

                    <div>
                        <div className="border-X border-black rounded-2xl shadow-X bg-white mx-4">
                            <table className="font-light justify-self-center w-full">
                                <thead>
                                    <tr className="text-xs">
                                        <th className="px-0 py-2"></th>
                                        <th className="px-1 py-2">ID</th>
                                        <th className="px-2 py-2">部位</th>
                                        <th className="px-2 py-2">時間</th>
                                        <th className="px-2 py-2">日付</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record, index) => (
                                        <tr
                                            key={record.id}
                                            onClick={(e) => handleRowClick(record.id, index, e)}
                                            className="cursor-pointer"
                                        >
                                            <td className="border-t-2 border-black px-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRecords.has(record.id)}
                                                    onChange={(e) => {
                                                        const shiftKey = (e.nativeEvent as KeyboardEvent).shiftKey;
                                                        toggleSelectRecord(record.id, index, shiftKey);
                                                    }}
                                                />
                                            </td>
                                            <td className="border-t-2 border-black pl-2 py-2 text-sm font-bold">{record.id}</td>
                                            <td className="border-t-2 border-black pl-2 py-2 font-bold">{record.bodyPart}</td>
                                            <td className="border-t-2 border-black pl-6 py-2 font-bold">{record.duration}分</td>
                                            <td className="border-t-2 border-black pl-6 py-2 text-sm font-bold">{record.trainingDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* モーダルA: 削除確認モーダル */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                        <div className="bg-white p-12 text-center border-X border-black rounded-2xl shadow-X font-bold">
                            <p>選択した記録を削除します。</p>
                            <p className='pb-4'>本当によろしいですか？</p>
                            <button onClick={handleDelete} className="button-primary mr-4">削除する</button>
                            <button onClick={() => setShowDeleteModal(false)} className="button-secondary">キャンセル</button>
                        </div>
                    </div>
                )}

                {/* モーダルB: 削除完了モーダル */}
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                        <div className="bg-white p-12 text-center border-X border-black rounded-2xl shadow-X">
                            <p className="text-lg font-bold">{deletedCount}件の記録を削除しました</p>
                            <button onClick={() => setShowSuccessModal(false)} className="button-primary">閉じる</button>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Log;
