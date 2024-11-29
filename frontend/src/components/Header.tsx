// frontend/src/components/Header.tsx

import React from "react";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();

  // ページ遷移関数
  const navigateToPage = (path: string) => {
    router.push(path);
  };

  // 現在のルートに基づいてボタンの背景色を動的に変更
  const getButtonClass = (path: string) =>
    router.pathname === path
      ? "bg-white text-black" // 現在のページの場合
      : "hover:text-gray-400"; // 他のページの場合

  return (
    <header className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-md">
      <div className="flex justify-between items-center h-16 mx-4">
        <h1 className="text-2xl">積みトレ</h1>
        <nav>
          <ul className="flex space-x-6 text-sm">
            <li>
              <button
                onClick={() => navigateToPage("/dashboard")}
                className={`px-4 py-2 ${getButtonClass("/dashboard")}`}
              >
                記録する
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateToPage("/memory")}
                className={`px-4 py-2 ${getButtonClass("/memory")}`}
              >
                振り返る
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateToPage("/settings")}
                className={`px-4 py-2 ${getButtonClass("/settings")}`}
              >
                設定
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
