// src/pages/_app.tsx
import 'tailwindcss/tailwind.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app'
import Header from "../components/Header";



const App = ({ Component, pageProps }: any) => {
  return (
    <div>
      <Header /> {/* 全ページで共通のヘッダー */}
      <main className="p-0">
        <Component {...pageProps} /> {/* 各ページコンポーネント */}
      </main>
    </div>
  );
};

export default App

