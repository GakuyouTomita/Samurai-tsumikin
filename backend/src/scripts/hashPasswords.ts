import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

const DB_PATH = '/Users/gakuyo/tsumitore/backend/src/database/users.db';
const db = new sqlite3.Database(DB_PATH);

// User 型を定義
interface User {
    id: number;
    username: string;
    password: string;
}

async function hashPasswords() {
    const query = `SELECT id, username, password FROM users`;

    // db.all のコールバック関数に型を指定
    db.all(query, async (err, rows: User[]) => {
        if (err) {
            console.error('データベースエラー:', err);
            return;
        }

        for (const user of rows) {
            // 型が明示されたので、user.password などを安全に使用可能
            if (!user.password.startsWith('$2b$')) { // 既にハッシュ化されているか確認
                try {
                    const hashedPassword = await bcrypt.hash(user.password, 10);
                    const updateQuery = `UPDATE users SET password = ? WHERE id = ?`;

                    db.run(updateQuery, [hashedPassword, user.id], (updateErr) => {
                        if (updateErr) {
                            console.error(`パスワード更新エラー (ID: ${user.id}):`, updateErr);
                        } else {
                            console.log(`ユーザーID ${user.id} のパスワードをハッシュ化しました`);
                        }
                    });
                } catch (hashErr) {
                    console.error(`パスワードハッシュ化エラー (ID: ${user.id}):`, hashErr);
                }
            } else {
                console.log(`ユーザーID ${user.id} は既にハッシュ化済みです`);
            }
        }
    });
}

hashPasswords();
