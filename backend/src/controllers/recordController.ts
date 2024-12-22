// backend/src/controllers/recordController.ts

import { Request, Response, NextFunction,} from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import db from "../index";
import express from "express";

const app = express();
// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Initialize database connection
const initializeDatabase = async () => {
    return open({
        filename: "./database/Records.db",
        driver: sqlite3.Database,
    });
};

// Save a new record
export const saveRecord = (req: Request, res: Response): void => {
    const { bodyPart, trainingDate, startTime, duration } = req.body;

    // 必須フィールドのチェック
    if (
        !bodyPart || typeof bodyPart !== "string" ||
        !trainingDate || !/^\d{4}-\d{2}-\d{2}$/.test(trainingDate) ||
        !startTime || !/^\d{2}:\d{2}$/.test(startTime) ||
        duration === undefined || isNaN(duration)
    ) {
        res.status(400).json({
            error: "無効な入力値があります",
            invalidFields: { bodyPart, trainingDate, startTime, duration }
        });
        return;
    }

    const query = `
        INSERT INTO Records (bodyPart, trainingDate, startTime, duration)
        VALUES (?, ?, ?, ?)
    `;

    db.run(query, [bodyPart, trainingDate, startTime, duration], function (err) {
        if (err) {
            console.error("データベースエラー:", err.message);
            res.status(500).json({ error: "データの保存中にエラーが発生しました" });
            return;
        }

        console.log("新しいデータが保存されました:", { id: this.lastID, bodyPart, trainingDate, startTime, duration });
        res.status(201).json({
            message: "新しいデータが保存されました",
            record: { id: this.lastID, bodyPart, trainingDate, startTime, duration }
        });
    });
};

export const getAllRecords = (req: Request, res: Response) => {
    const query = "SELECT * FROM Records";

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("データベースエラー:", err.message);
            res.status(500).json({ error: "すべてのレコードを取得中にエラーが発生しました" });
            return;
        }
        res.json(rows);
        console.log("Recordsテーブルから全てのレコードを取得しました");
    });
};

export const getLatestRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const query = "SELECT * FROM Records ORDER BY id DESC LIMIT 1";

    db.get(query, [], (err, row) => {
        if (err) {
            console.error("データベースエラー:", err.message);
            res.status(500).json({ error: "最新のレコードを取得中にエラーが発生しました" });
            return;
        }
        res.json(row ? [row] : []);
        console.log("Recordsテーブルから最新のレコードを取得しました:", row);
    });
};

export const getAllCounts = (req: Request, res: Response) => {
    const query = "SELECT COUNT(*) AS count FROM records";

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("データベースエラー:", err.message);
            res.status(500).json({ error: "すべてのレコード数を取得中にエラーが発生しました" });
            return;
        }
        console.log("取得した行:", rows);  // ここでrowsの中身を確認
        res.json(rows);  // 返す値が期待通りか確認
        console.log("Recordsテーブルから全てのレコード数を取得しました:", rows);
    });
};



// Get status (days since last and total records for bodyPart)
export const getStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const bodyPart = req.query.bodyPart as string; // 明示的にstring型にキャスト
        const trainingDate = req.query.trainingDate as string; // 明示的にstring型にキャスト

        console.log("Request query:", req.query);

        // 必須パラメータのチェック
        if (!bodyPart || typeof bodyPart !== "string" || !trainingDate || typeof trainingDate !== "string") {
            res.status(400).json({ error: "bodyPart and trainingDate are required and must be strings." });
            return;
        }

        const db = await initializeDatabase();
        console.log("Database initialized");

        // 前回のトレーニング日を取得
        const previousRecord = await db.get<{ trainingDate: string }>(
            "SELECT trainingDate FROM Records WHERE bodyPart = ? AND trainingDate < ? ORDER BY trainingDate DESC LIMIT 1",
            [bodyPart, trainingDate]
        ).catch((error) => {
            console.error("Error in fetching previous record:", error);
            throw error;
        });

        const lastTrainingDate = previousRecord ? new Date(previousRecord.trainingDate) : null;
        const currentTrainingDate = new Date(trainingDate);

        // 経過日数を計算
        const daysSinceLast = lastTrainingDate
            ? Math.floor((currentTrainingDate.getTime() - lastTrainingDate.getTime()) / (1000 * 60 * 60 * 24))
            : null;

        // 総記録数を取得
        const totalRecordsResult = await db.get<{ totalRecords: number }>(
            "SELECT COUNT(*) AS totalRecords FROM Records WHERE bodyPart = ?",
            [bodyPart]
        );

        const totalRecords = totalRecordsResult ? totalRecordsResult.totalRecords : 0;

        console.log("Previous record:", previousRecord);
        console.log("Total records result:", totalRecordsResult);
        console.log("フロントエンドに返却するdaysSinceLast:", daysSinceLast, "totalRecords", totalRecords);

        // 結果を返却
        res.json({ daysSinceLast, totalRecords });
        await db.close();
    } catch (error) {
        console.error("Error getting status:", error);
        next(error);
    }
};



// Delete a record by ID
export const deleteRecord = (req: Request, res: Response): void => {
    const recordId = req.params.id;

    // Validate the record ID
    if (!recordId || isNaN(Number(recordId))) {
        res.status(400).json({ error: "Invalid record ID format" });
        return;
    }

    const query = "DELETE FROM Records WHERE id = ?";
    db.run(query, [recordId], function (err) {
        if (err) {
            console.error("Database error:", err.message);
            res.status(500).json({ error: "Database error during delete operation" });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ error: "Record not found" });
        } else {
            res.status(200).json({ message: "Record deleted successfully" });
        }
    });
};

