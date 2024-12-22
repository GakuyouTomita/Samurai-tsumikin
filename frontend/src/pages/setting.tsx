import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Setting = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    // ログアウト処理
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        router.push('/');
    };


    return (
        <div className="flex justify-center bg-bg bg-fixed bg-cover h-screen overflow-y-auto">
            <div className="flex flex-col w-full max-w-[414px] bg-bgbg ">
                <div className="mt-24 items-center justify-start text-center">

                    <div className="shadow-X bg-white border-black border-X py-4 mx-4 flex flex-col items-center rounded-2xl">
                        <div className="text-xl font-bold mb-2">
                            構築環境
                        </div>
                        <div className="text-bs font-bold">
                        <p>フロントエンド：React / Next.js</p>
                        <p> バックエンド：Node.js / Express.js</p>
                        <p> データベース：SQLite3</p>
                        <p> CSS：TailwindCSS</p>
                        <p>その他：Typescript, Chart.js</p>
                        </div>




                    </div>

                    <button className='border-black border-X justify-self-end text-white bg-button px-4 py-1 my-1 mx-4 text-base font-bold rounded-xl shadow-B button-osikomi mt-10'
                        onClick={handleLogout}
                    >
                        ログアウト
                    </button>
                </div>
            </div>

        </div>

    );
};



export default Setting;
