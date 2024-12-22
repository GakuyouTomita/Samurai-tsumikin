// backend/src/index.ts

import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
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
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// エンドポイントアクセス確認用
app.use("/api", (req, res, next) => {
  console.log(`API route accessed: ${req.method} ${req.originalUrl}`);
  next(); 
});

// ルート設定
app.use("/auth", authRoutes);
app.use("/api", recordRoutes);


const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default db;





