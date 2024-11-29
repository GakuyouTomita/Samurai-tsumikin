// backend/src/config/database.ts

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// SQLite3のデータベース接続を作成する関数
const createDatabaseConnection = async () => {
  const db = await open({
    filename: path.resolve(__dirname, '../../database/database.sqlite'),
    driver: sqlite3.Database,
  });

  return db;
};

export default createDatabaseConnection;
