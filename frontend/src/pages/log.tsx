// frontend/src/pages/log.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Record {
    id: number;
    bodyPart: string;
    duration: number; // トレーニング時間（秒）
    trainingDate: string; // 日付
    startTime: string; // トレーニング開始時間
}

const Log: React.FC = () => {
    const [records, setRecords] = useState<Record[]>([]);
    const [editingRecord, setEditingRecord] = useState<Record | null>(null);
    const [selectedRecords, setSelectedRecords] = useState<Set<number>>(new Set());
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // データを取得する関数を分離
    const fetchRecords = async () => {
        try {
            const response = await axios.get("http://localhost:3002/api/record");
            setRecords(response.data);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    useEffect(() => {
        // 初回ロード時にデータ取得
        fetchRecords();
    }, []);

    const handleEdit = (record: Record) => {
        setEditingRecord(record);
    };

    const handleDelete = async () => {
        if (selectedRecords.size > 0) {
            try {
                const idsToDelete = Array.from(selectedRecords);
                // 各レコードを削除
                await Promise.all(idsToDelete.map(id => axios.delete(`http://localhost:3002/api/record/${id}`)));
                // データ再取得
                await fetchRecords();
                // 状態をリセット
                setSelectedRecords(new Set());
                setShowDeleteModal(false);
            } catch (error) {
                console.error('Error deleting records:', error);
            }
        }
    };

    const handleSave = async () => {
        if (editingRecord) {
            try {
                await axios.put(`http://localhost:3002/api/record/${editingRecord.id}`, editingRecord);
                await fetchRecords(); // 編集後もデータを再取得
                setEditingRecord(null);
            } catch (error) {
                console.error('Error saving record:', error);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (editingRecord) {
            setEditingRecord({
                ...editingRecord,
                [field]: e.target.value,
            });
        }
    };

    const toggleSelectRecord = (id: number) => {
        const newSelectedRecords = new Set(selectedRecords);
        if (newSelectedRecords.has(id)) {
            newSelectedRecords.delete(id);
        } else {
            newSelectedRecords.add(id);
        }
        setSelectedRecords(newSelectedRecords);
    };

    return (
        <div className="flex flex-col items-center bg-bg py-20">
            <div className="w-[414px]">
                <div className="mt-10 mb-2 text-xl font-bold text-left">すべての記録</div>

                {/* Deleteボタン */}
                <div className="my-2 justify-self-end">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        disabled={selectedRecords.size === 0}
                        className="border-X border-black rounded-xl shadow-X px-3 py-1 text-sm text-black active:bg-gra-green disabled:bg-gray-200 disabled:text-gray-400"
                    >
                        選択データを削除
                    </button>
                </div>

                {/* レコード一覧表示 */}
                <div>
                    <div className="border-X border-black rounded-2xl shadow-X bg-white">
                        <table className="font-light justify-self-center w-full">
                            <thead>
                                <tr className="text-xs">
                                    <th className="px-2 py-2"></th>
                                    <th className="px-3 py-2">BodyPart</th>
                                    <th className="px-1 py-2">Duration</th>
                                    <th className="px-3 py-2">Date</th>
                                    <th className="px-0 py-2">StartTime</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record) => (
                                    <tr key={record.id}>
                                        <td className="border-b-2 border-t-2 border-black px-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedRecords.has(record.id)}
                                                onChange={() => toggleSelectRecord(record.id)}
                                            />
                                        </td>
                                        <td className="border-b-2 border-t-2 border-black px-2 py-1">{record.bodyPart}</td>
                                        <td className="border-b-2 border-t-2 border-black px-2 py-1">{record.duration}</td>
                                        <td className="border-b-2 border-t-2 border-black px-2 py-1">{record.trainingDate}</td>
                                        <td className="border-b-2 border-t-2 border-black px-2 py-1">{record.startTime}</td>
                                        <td className="border-b-2 border-t-2 border-black px-2 py-2">
                                            <button onClick={() => handleEdit(record)} className="border-X border-black rounded-xl shadow-X py-1 px-2 text-sm text-black bg-gra-green">編集</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 編集フォーム */}
            {editingRecord && (
                <div className="edit-form">
                    <h2>Edit Record</h2>
                    <form>
                        <label>
                            Body Part:
                            <input
                                type="text"
                                value={editingRecord.bodyPart}
                                onChange={(e) => handleChange(e, 'bodyPart')}
                            />
                        </label>
                        <label>
                            Duration (Seconds):
                            <input
                                type="number"
                                value={editingRecord.duration}
                                onChange={(e) => handleChange(e, 'duration')}
                            />
                        </label>
                        <label>
                            Date:
                            <input
                                type="date"
                                value={editingRecord.trainingDate}
                                onChange={(e) => handleChange(e, 'trainingDate')}
                            />
                        </label>
                        <label>
                            Start Time:
                            <input
                                type="time"
                                value={editingRecord.startTime}
                                onChange={(e) => handleChange(e, 'startTime')}
                            />
                        </label>
                        <button type="button" onClick={handleSave}>
                            Save
                        </button>
                        <button type="button" onClick={() => setEditingRecord(null)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {/* 削除確認モーダル */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white px-10 py-10 rounded-lg shadow-lg text-center z-[60]">
                        <p>選択したデータを削除します。</p><p>本当によろしいですか？</p>
                        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-1.5 mr-2 mt-4 bg-black">削除する</button>
                        <button onClick={() => setShowDeleteModal(false)} className="bg-white border-X border-black px-3 py-1 mt-4">キャンセル</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Log;
