// backend/src/config/database.ts

import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "../database/Records.db");

/**
 * Initialize and return a SQLite database connection.
 * Creates the required tables if they don't exist.
 */
const initializeDatabase = (): sqlite3.Database => {
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error("データベース接続エラー:", err.message);
            process.exit(1); // Critical error, terminate the process.
        } else {
            console.log("データベースに接続しました");
        }
    });

    // Create tables if they do not exist
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
            console.log("Records テーブルが確認されました");
        }
    });

    return db;
};

export default initializeDatabase;
