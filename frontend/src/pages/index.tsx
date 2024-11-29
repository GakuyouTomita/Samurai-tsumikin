// frontend/src/pages/index.tsx

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // エラー状態を管理するためのステート
  const router = useRouter();
  console.log(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`);
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { // 環境変数を使用
        username,
        password
      });
      console.log(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`);
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard'); //ログイン後の飛び先ページ
    } catch (err) {
      setError('Invalid credentials'); // エラーメッセージをステートにセット
      console.error((err as Error).message); // エラーの詳細をコンソールに出力
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-start gap-4 pt-40">

      <div className="grid grid-cols-2 grid-rows-3 gap-x-2 gap-y-1 group cursor-pointer">
        <div className="border-X border-black w-32 h-12 bg-fukkin"></div>
        <div className="border-X border-black w-24 h-12 bg-kyoukin"></div>
        <div className="border-X border-black w-24 h-12 bg-ude justify-self-end"></div>
        <div className="border-X border-black w-32 h-12 bg-kata"></div>
        <div className="border-X border-black w-24 h-12 bg-kahanshin justify-self-end"></div>
        <div className="border-X border-black w-32 h-12 bg-green1"></div>
      </div>
      <div className="font-medium text-4xl mt-12 mb-4">積みトレ</div>
      <input
        className="py-3 px-2 border-X border-black rounded-2xl shadow-X"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="py-3 px-2 border-X border-black rounded-2xl shadow-X"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-green1 text-lg text-black px-10 py-3 font-bold mt-2 border-X border-black rounded-2xl shadow-X"
        onClick={handleLogin}>ログイン</button>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* エラーメッセージを表示 */}
    </div>

  );
}
