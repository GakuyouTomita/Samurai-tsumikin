// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';

const SECRET_KEY = 'your_secret_key';

// SQLite3データベースの接続設定
const DB_PATH = process.env.DB_PATH || '/Users/gakuyo/tsumitore/backend/src/database/users.db';
const db = new sqlite3.Database(DB_PATH);

// Userインターフェースの定義
interface User {
    id: number;
    username: string;
    password: string;
}

class AuthController {
    // 新規登録
    async signUp(req: Request, res: Response) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'ユーザー名とパスワードを入力してください' });
        }

        try {
            // パスワードをハッシュ化
            const hashedPassword = await bcrypt.hash(password, 10);

            // SQLite3にユーザー情報を保存
            const query = `INSERT INTO users (username, password) VALUES (?, ?)`;

            db.run(query, [username, hashedPassword], function (err) {
                if (err) {
                    return res.status(500).json({ message: 'ユーザー登録中にエラーが発生しました' });
                }

                res.status(201).json({ message: 'ユーザーが作成されました' });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'ユーザー登録中にエラーが発生しました' });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        console.log('login関数が呼び出されました'); // 関数開始ログ
    
        const { username, password } = req.body;
        console.log('受け取ったデータ:', { username, password }); // リクエストデータのログ
    
        if (!username || !password) {
            console.log('入力データが不足しています'); // 入力エラーログ
            res.status(400).json({ message: 'ユーザー名とパスワードを入力してください' });
            return;
        }
    
        try {
            const query = `SELECT * FROM users WHERE username = ?`;
            console.log('SQLクエリを実行します:', query); // SQLクエリのログ
    
            db.get(query, [username], async (err, row: User) => {
                if (err) {
                    console.error('SQLエラー:', err); // SQLエラーのログ
                    res.status(500).json({ message: 'データベースエラーが発生しました' });
                    return;
                }
    
                if (!row) {
                    console.log('ユーザーが見つかりません'); // ユーザーが存在しない場合
                    res.status(401).json({ message: 'ユーザーが見つかりません' });
                    return;
                }
    
                console.log('データベースから取得したユーザー:', row); // 取得したユーザー情報
    
                // 照合対象の情報をログ出力
                console.log('入力されたパスワード:', password);
                console.log('データベースから取得したハッシュ化パスワード:', row.password);
    
                // パスワード照合
                const isMatch = await bcrypt.compare(password, row.password);
                console.log('パスワードの照合結果:', isMatch); // 照合結果をログ
    
                if (isMatch) {
                    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '12h' });
                    console.log('JWTトークンが生成されました:', token); // JWTトークン生成のログ
                    res.json({ token });
                } else {
                    console.log('パスワードが一致しません'); // 照合失敗ログ
                    res.status(401).json({ message: 'ログインできませんでした' });
                }
            });
        } catch (error) {
            console.error('エラーが発生しました:', error); // その他のエラーログ
            res.status(500).json({ message: 'ログイン中にエラーが発生しました' });
        }
    }
    
    
    

    // トークンの検証
    async validateToken(req: Request, res: Response) {
        const token = req.headers['authorization']?.split(' ')[1];

        if (token) {
            jwt.verify(token, SECRET_KEY, (err) => {
                if (err) {
                    res.status(403).json({ message: 'Invalid token' });
                } else {
                    res.status(200).json({ message: 'Valid token' });
                }
            });
        } else {
            res.status(401).json({ message: 'Token missing' });
        }
    }
}

export default new AuthController();
