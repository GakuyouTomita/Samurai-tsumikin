
// frontend/src/pages/dashboard.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      axios
        .post("http://localhost:3002/auth/validate", null, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem("token");
          router.push("/");
        });
    }
  }, [router]);

  const navigateToRecord = (bodyPart: string) => {
    router.push(`/record?bodypart=${encodeURIComponent(bodyPart)}`);
  };

  const baseButtonClasses =
    "w-full group relative inline-flex items-center justify-center overflow-hidden px-6 text-2xl font-medium text-white transition-all border border-2 border-black1 text-stroke text-stroke-8 text-stroke-black1 box-shadow";


  return (
    <div className="min-h-screen bg-bg flex items-start justify-center pt-20">
      {isAuthenticated ? (
        <div className="w-full max-w-[414px]">
          <div className="grid grid-cols-[3fr,1fr,3fr]  grid-rows-2">
            <div className="rounded-full bg-black my-2 h-10 w-10 justify-self-end"></div>
            <div className="bg-gray-400 h-0.5 w-20 mt-6"></div>
            <div className="rounded-full bg-white my-2 h-10 w-10 border-X border-gray-400"></div>
            <div className="text-xs font-bold  justify-self-end mx-2">部位</div>
            <div className=""></div>
            <div className="text-xs text-gray-400 font-bold  justify-self-start mx-2">詳細</div>
          </div>



          <div className="grid grid-cols-4 auto-rows-auto gap-x-3 gap-y-2">
            <div className="w-full group relative inline-flex items-center justify-center overflow-hidden py-2 transition-all col-start-1 col-end-5 row-start-1 row-end-2 text-xl font-bold text-black1 text-center">
              部位を選ぶ</div>

            {/* 肩・背中 */}
            <div className="col-start-1 col-end-5 row-start-2 row-end-3 flex justify-center">
              <button
                className={`$ bg-kata py-8 px-48 hover:bg-kataH border-black border-X rounded-xl shadow-X`}
                onClick={() => navigateToRecord("肩・背中")}
              >
              </button>
            </div>

            {/* 胸筋 */}
            <div
              className="col-start-2 col-end-4 row-start-3 row-end-4"
              onClick={() => navigateToRecord("胸筋")}
            >
              <div className="grid grid-cols-2 grid-rows-1 gap-x-2 gap-y-1 group cursor-pointer">
                <div className="w-24 h-24 bg-kyoukin group-hover:bg-kyoukinH border-black border-X rounded-xl shadow-X"></div>
                <div className="w-24 h-24 bg-kyoukin group-hover:bg-kyoukinH border-black border-X rounded-xl shadow-X"></div>
              </div>
            </div>

            {/* 腹筋 */}
            <div
              className="col-start-2 col-end-4 row-start-4 row-end-6"
              onClick={() => navigateToRecord("腹筋")}
            >
              <div className="grid grid-cols-2 grid-rows-3 gap-x-2 gap-y-1 group cursor-pointer">
                <div className="border-black border-X rounded-xl shadow-X w-20 h-12 bg-fukkin group-hover:bg-fukkinH justify-self-end"></div>
                <div className="border-black border-X rounded-xl shadow-X w-20 h-12 bg-fukkin group-hover:bg-fukkinH"></div>
                <div className="border-black border-X rounded-xl shadow-X w-20 h-12 bg-fukkin group-hover:bg-fukkinH justify-self-end"></div>
                <div className="border-black border-X rounded-xl shadow-X w-20 h-12 bg-fukkin group-hover:bg-fukkinH"></div>
                <div className="border-black border-X rounded-xl shadow-X w-20 h-12 bg-fukkin group-hover:bg-fukkinH  justify-self-end"></div>
                <div className="border-black border-X rounded-xl shadow-X w-20 h-12 bg-fukkin group-hover:bg-fukkinH"></div>
              </div>
            </div>


            {/* 右腕 */}
            <div
              className="col-start-4 col-end-5 row-start-3 row-end-7"
              onClick={() => navigateToRecord("腕")}
            >
              <div className="group">
                <div className="border-black border-X rounded-xl shadow-X bg-ude group-hover:bg-udeH w-20 h-24 mb-2"></div>
                <div className="border-black border-X rounded-xl shadow-X bg-ude group-hover:bg-udeH w-20 h-32 mb-2"></div>
                <div className="border-black border-X rounded-xl shadow-X bg-ude group-hover:bg-udeH w-16 h-12"></div>
              </div>
            </div>

            {/* 左腕 */}
            <div
              className="col-start-1 col-end-2 row-start-3 row-end-7 justify-self-end"
              onClick={() => navigateToRecord("腕")}
            >
              <div className="group">
                <div className="border-black border-X rounded-xl shadow-X bg-ude group-hover:bg-udeH w-20 h-24 mb-2"></div>
                <div className="border-black border-X rounded-xl shadow-X bg-ude group-hover:bg-udeH w-20 h-32 mb-2"></div>
                <div className="border-black border-X rounded-xl shadow-X bg-ude group-hover:bg-udeH w-16 h-12 justify-self-end"></div>
              </div>
            </div>

            {/* 下半身 */}
            <div
              className="col-start-2 col-end-4 row-start-6 row-end-7"
              onClick={() => navigateToRecord("下半身")}
            >
              <div className="grid grid-cols-1 grid-rows-[56px,492px,48px] group cursor-pointer ">
                <div className="border-black border-X rounded-xl shadow-X  bg-kahanshin group-hover:bg-kahanshinH w-48 h-16 justify-self-center"></div>
                <div className="grid grid-cols-2 grid-rows-2 gap-x-2">
                  <div className="border-black border-X rounded-xl shadow-X  bg-kahanshin group-hover:bg-kahanshinH w-24 h-56 translate-x-0 translate-y-4 "></div>
                  <div className="border-black border-X rounded-xl shadow-X  bg-kahanshin group-hover:bg-kahanshinH w-24 h-56 translate-x-0 translate-y-4"></div>
                  <div className="border-black border-X rounded-xl shadow-X  bg-kahanshin group-hover:bg-kahanshinH w-16 h-16 translate-x-8 translate-y-1"></div>
                  <div className="border-black border-X rounded-xl shadow-X  bg-kahanshin group-hover:bg-kahanshinH w-16 h-16 translate-x-0 translate-y-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>


      ) : (
        <p className="text-2xl text-white">Redirecting...</p>
      )}
    </div>
  );
}
