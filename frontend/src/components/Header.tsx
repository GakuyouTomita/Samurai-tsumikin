// frontend/src/components/Header.tsx

import React from "react";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();

  // ページ遷移関数
  const navigateToPage = (path: string) => {
    router.push(path);
  };

  const getButtonClass = (paths: string[]) =>
    paths.includes(router.pathname)
      ? "bg-white text-black font-bold border-2 border-black" // 現在のページの場合
      : "hover:text-gray-200"; // 他のページの場合

  return (
    <header className="fixed top-0 left-0 w-full bg-green2 text-white z-50 shadow-md border-b-X border-black">
      <div className="flex justify-between items-center h-16 mx-4">
        <button
          onClick={() => navigateToPage("/")}
          className={`px-4 py-2 rounded-2xl text-xl font-bold`}
        >
          TSUMIKIN
        </button>
        <nav>
          <ul className="flex space-x-2 text-sm">
            <li>
              <button
                onClick={() => navigateToPage("/partselect")}
                className={`px-2 py-2 rounded-2xl text-sm ${getButtonClass(["/partselect", "/record"])}`}
              >
                記録する
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateToPage("/memory")}
                className={`px-2 py-2 rounded-2xl text-sm ${getButtonClass(["/memory", "/log"])}`}
              >
                振り返る
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateToPage("/setting")}
                className={`px-2 py-2 rounded-2xl text-sm ${getButtonClass(["/setting"])}`}
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
