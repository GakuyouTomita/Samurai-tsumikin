// backend/src/controllers/recordController.ts
import { Request, Response, NextFunction } from "express";
import createDatabaseConnection from "../config/database";

export const saveRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bodyPart, trainingDate, startTime, duration } = req.body;

    // 必須項目のバリデーション
    if (!bodyPart || !trainingDate || !startTime || !duration) {
      res.status(400).json({ error: "すべての項目を入力してください。" });
      return;
    }

    // データベースに接続
    const db = await createDatabaseConnection();

    // データベースに記録を保存
    await db.run(
      "INSERT INTO workouts (body_part, training_date, start_time, duration) VALUES (?, ?, ?, ?)",
      [bodyPart, trainingDate, startTime, duration]
    );

    // 成功した場合のレスポンス
    res.status(201).json({ message: "記録が保存されました。" });

    // データベース接続を閉じる
    await db.close();
  } catch (error) {
    console.error("エラー:", error);
    next(error);
  }
};
