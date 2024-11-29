// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

class AuthController {
    async login(req: Request, res: Response) {
        const { username, password } = req.body;

        console.log("Received Username:", username);
        console.log("Received Password:", password);

        // サンプルユーザー
        const sampleUser = {
            username: 'user',
            password: 'pass'
        };
        console.log(sampleUser);

        // ユーザー名とパスワードの照合
        if (username === sampleUser.username && password === sampleUser.password) {
            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }


    async validateToken (req: Request, res: Response) {
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
    };
}

export default new AuthController();
