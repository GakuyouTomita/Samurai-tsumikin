
// frontend/src/pages/partselect.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import PopAnimation from '../components/PopAnimation';


export default function PartSelectPage() {
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


  return (
    <div className="flex justify-center bg-bg bg-fixed bg-cover overflow-y-auto">
      <div className="w-full max-w-[414px] h-[1000px] bg-bgbg bg-fixed">
      {isAuthenticated ? (

          <div className="w-full pt-24">

            <div className="grid grid-cols-4 gap-x-3 gap-y-2">
              <div className="group relative inline-flex items-center justify-center overflow-hidden transition-all col-start-1 col-end-5 row-start-1 row-end-2 text-xl font-bold text-black1 text-center bg-white border-black border-X py-8 mb-8 mx-8 flex-col rounded-2xl">
                きたえた部位をえらぼう！
              </div>

              {/* 肩/背中 */}
              <div className="col-start-1 col-end-5 row-start-2 row-end-3 flex justify-center">
                <PopAnimation>
                  <button
                    className={`$ bg-kata py-8 px-48 hover:bg-kataH border-black border-X rounded-xl shadow-X`}
                    onClick={() => navigateToRecord("肩/背中")}
                  >
                  </button>
                </PopAnimation>
              </div>

              {/* 胸筋 */}
              <div
                className="col-start-2 col-end-4 row-start-3 row-end-4"
                onClick={() => navigateToRecord("胸筋")}
              >
                <PopAnimation>
                  <div className="grid grid-cols-2 grid-rows-1 gap-x-2 gap-y-1 group cursor-pointer">
                    <div className="w-24 h-20 bg-kyoukin group-hover:bg-hover border-black border-X rounded-xl shadow-X"></div>
                    <div className="w-24 h-20 bg-kyoukin group-hover:bg-hover border-black border-X rounded-xl shadow-X"></div>
                  </div>
                </PopAnimation>
              </div>

              {/* 腹筋 */}
              <div
                className="col-start-2 col-end-4 row-start-4 row-end-6"
                onClick={() => navigateToRecord("腹筋")}
              >
                <PopAnimation>
                  <div className="grid grid-cols-2 grid-rows-3 gap-x-2 gap-y-1 group cursor-pointer">
                    <div className="border-black border-X rounded-xl shadow-X w-20 h-12 bg-fukkin group-hover:bg-hover justify-self-end"></div>
                    <div className="border-black border-X rounded-xl shadow-X w-20 h-12 bg-fukkin group-hover:bg-hover"></div>
                    <div className="border-black border-X rounded-xl shadow-X w-20 h-12 bg-fukkin group-hover:bg-hover justify-self-end"></div>
                    <div className="border-black border-X rounded-xl shadow-X w-20 h-12 bg-fukkin group-hover:bg-hover"></div>
                    <div className="border-black border-X rounded-xl shadow-X w-20 h-12 bg-fukkin group-hover:bg-hover  justify-self-end"></div>
                    <div className="border-black border-X rounded-xl shadow-X w-20 h-12 bg-fukkin group-hover:bg-hover"></div>
                  </div>
                </PopAnimation>
              </div>


              {/* 右腕 */}
              <div
                className="col-start-4 col-end-5 row-start-3 row-end-7"
                onClick={() => navigateToRecord("腕")}
              >
                <PopAnimation>
                  <div className="group cursor-pointer">
                    <div className="border-black border-X rounded-xl shadow-X bg-ude group-hover:bg-hover w-20 h-24 mb-2"></div>
                    <div className="border-black border-X rounded-xl shadow-X bg-ude group-hover:bg-hover w-20 h-32 mb-2"></div>
                    <div className="border-black border-X rounded-xl shadow-X bg-ude group-hover:bg-hover w-16 h-12"></div>
                  </div>
                </PopAnimation>
              </div>

              {/* 左腕 */}
              <div
                className="col-start-1 col-end-2 row-start-3 row-end-7 justify-self-end"
                onClick={() => navigateToRecord("腕")}
              >
                <PopAnimation>
                  <div className="group cursor-pointer">
                    <div className="border-black border-X rounded-xl shadow-X bg-ude group-hover:bg-hover w-20 h-24 mb-2"></div>
                    <div className="border-black border-X rounded-xl shadow-X bg-ude group-hover:bg-hover w-20 h-32 mb-2"></div>
                    <div className="border-black border-X rounded-xl shadow-X bg-ude group-hover:bg-hover w-16 h-12 justify-self-end"></div>
                  </div>
                </PopAnimation>
              </div>

              {/* 下半身 */}
              <div
                className="col-start-2 col-end-4 row-start-6 row-end-6"
                onClick={() => navigateToRecord("下半身")}
              >
                <PopAnimation>
                  <div className="grid grid-cols-1 grid-rows-[40px,300px,30px] group cursor-pointer">
                    <div className="border-black border-X rounded-xl shadow-X  bg-kahanshin group-hover:bg-hover w-48 h-12 justify-self-center"></div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-x-2">
                      <div className="border-black border-X rounded-xl shadow-X  bg-kahanshin group-hover:bg-hover w-24 h-52 translate-x-0 translate-y-4 "></div>
                      <div className="border-black border-X rounded-xl shadow-X  bg-kahanshin group-hover:bg-hover w-24 h-52 translate-x-0 translate-y-4"></div>
                      <div className="border-black border-X rounded-xl shadow-X  bg-kahanshin group-hover:bg-hover w-16 h-16 translate-x-8 translate-y-1 mt-20"></div>
                      <div className="border-black border-X rounded-xl shadow-X  bg-kahanshin group-hover:bg-hover w-16 h-16 translate-x-0 translate-y-1 mt-20"></div>
                    </div>
                  </div>
                </PopAnimation>
              </div>
            </div>

          </div>


        ) : (
          <p className="text-2xl text-white">Redirecting...</p>
        )}
      </div>
    </div>

  );
}
