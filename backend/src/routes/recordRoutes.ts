// backend/src/routes/recordRoutes.ts
import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import path from "path";

const router = express.Router();

// SQLiteデータベースの準備
const dbPath = path.resolve(__dirname, "../database/Records.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("データベース接続エラー:", err.message);
    } else {
        console.log("データベースに接続しました");
    }
});

// テーブル確認・作成
db.run(`
  CREATE TABLE IF NOT EXISTS Records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bodyPart TEXT NOT NULL,
    trainingDate TEXT NOT NULL,
    startTime TEXT NOT NULL,
    duration INTEGER NOT NULL
  )
`, (err) => {
    if (err) {
        console.error("テーブル作成エラー:", err.message);
    } else {
        console.log("テーブルが確認されました");
    }
});



// GETリクエストを処理（筋トレ記録の取得）
router.get("/record", (req: Request, res: Response): void => {
    const query = "SELECT * FROM Records"; // Recordsテーブルから全てのレコードを取得

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("データベースエラー:", err.message);
            res.status(500).json({ error: "すべてのレコードを取得中にエラーが発生しました" });
            return;
        }
        res.json(rows); // レコードをJSONで返す
        console.log("Recordsテーブルから全てのレコードを取得しました");
    });
});

// 最新の記録を取得
router.get("/record/latest", (req: Request, res: Response): void => {
    const query = "SELECT * FROM Records ORDER BY id DESC LIMIT 1"; // 最新のIDのレコードを取得

    db.get(query, [], (err, row) => {
        if (err) {
            console.error("データベースエラー:", err.message);
            res.status(500).json({ error: "最新のレコードを取得中にエラーが発生しました" });
            return;
        }
        res.json(row ? [row] : []); // レコードがあれば配列として返す、なければ空配列を返す
        console.log("Recordsテーブルから最新のレコードを取得しました:", row);
    });

});



// ①POSTリクエストを処理（筋トレ記録の新規登録）
router.post("/record", (req: Request, res: Response): void => {
    const { bodyPart, trainingDate, startTime, duration } = req.body;

    // ②必須フィールドのチェック
    if (
        !bodyPart || typeof bodyPart !== "string" ||
        !trainingDate || !/^\d{4}-\d{2}-\d{2}$/.test(trainingDate) ||
        !startTime || !/^\d{2}:\d{2}$/.test(startTime) ||
        duration === undefined || isNaN(duration)
    ) {
        res.status(400).json({ error: "無効な入力値があります", invalidFields: { bodyPart, trainingDate, startTime, duration } });
        return;
    }

    // ③データベース「Records」テーブルに保存
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
        res.status(201).json({ message: "記録が保存されました！", recordId: this.lastID });
    });
});

// データ削除エンドポイント
router.delete("/record/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    db.run("DELETE FROM Records WHERE id = ?", [id], function (err) {
        if (err) {
            console.error("Error deleting record:", err.message);
            return res.status(500).json({ error: "Failed to delete record" });
        }

        if (this.changes === 0) {
            // 対象のレコードが見つからなかった場合
            return res.status(404).json({ error: "Record not found" });
        }

        res.status(200).json({ message: "Record deleted successfully" });
    });
});

export default router;
