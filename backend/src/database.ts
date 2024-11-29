// backend/src/database.ts
import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "database", "Records.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("データベース接続エラー！！:", err.message);
        process.exit(1);
    }
    console.log("データベースに接続しました@backend/src/database.ts");
});

export default db;
