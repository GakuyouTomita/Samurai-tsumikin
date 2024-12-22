// frontend/src/pages/index.tsx

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // エラー状態を管理するためのステート
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        username,
        password
      });
      console.log("Login response:", response);  // レスポンスの内容を確認
      console.log(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`);
      localStorage.setItem('token', response.data.token);
      router.push('/partselect'); //ログイン後の飛び先ページ
    } catch (err) {
      setError('ログインできませんでした'); // エラーメッセージをステートにセット
      console.error((err as Error).message); // エラーの詳細をコンソールに出力
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg ">
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-[414px] mt-24 bg-bgbg h-[600px] border-X border-black1 rounded-2xl">

        <div className="font-black text-6xl my-12">TSUMIKIN</div>
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
          className=" text-white px-8 py-4 mt-2 font-bold border-X border-black rounded-2xl shadow-B button-osikomi bg-button"
          onClick={handleLogin}>ログイン</button>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* エラーメッセージを表示 */}

        <p className=""></p>
      </div>
    </div>


  );
}
