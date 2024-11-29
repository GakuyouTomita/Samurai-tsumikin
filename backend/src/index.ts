// backend/src/index.ts

import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import router from "./routes/index";
import authRoutes from "./routes/authRoutes";
import recordRoutes from "./routes/recordRoutes";

const app = express();

// データベースファイルへの絶対パスを指定
const dbPath = path.resolve(__dirname, "./database/Records.db");
console.log("Database Path:", dbPath);

// SQLiteのデータベースに接続
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("データベース接続エラー！:", err.message);
  } else {
    console.log("データベースに接続しました@backend/src/index.ts");
  }
});

// CORS の設定を追加：フロントエンド (localhost:3000) からのリクエストを許可
app.use(
  cors({
    origin: "http://localhost:3000", // フロントエンドのオリジンを指定
    methods: ["GET", "POST", "PUT", "DELETE"], // 必要なHTTPメソッドを指定
    allowedHeaders: ["Content-Type", "Authorization"], // Authorization ヘッダーを許可
  })
);

// ミドルウェア設定
app.use(express.json()); // JSON リクエストのパース
app.use(express.urlencoded({ extended: true })); // URL エンコードされたデータを解析

// ルート設定
app.use("/auth", authRoutes); // ログイン関連ルート
app.use("/api", router); // API 全般のルート
app.use("/api/record/latest", recordRoutes);
app.use("/api", recordRoutes); // /api/record が利用可能に

// サーバー起動
const PORT = 3002; // 任意のポート番号
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default db;
