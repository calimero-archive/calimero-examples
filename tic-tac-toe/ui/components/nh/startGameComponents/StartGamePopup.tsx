import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import translations from "../../../constants/en.global.json";

const popupTranslations = translations.startNewGamePopup;

interface StartGamePopupProps {
  contractCall: (playerB) => void;
}

export default function StartGamePopup({ contractCall }: StartGamePopupProps) {
  const [playerB, setPlayerB] = useState("");
  const router = useRouter();
  const startGame = () => {
    contractCall(playerB);
    router.push("/");
  };
  return (
    <div>
      <div className="relative z-10">
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full justify-center items-center bg-[#000000d2]">
            <div className="relative overflow-hidden bg-nh-bglight rounded-lg py-6">
              <div className="text-4xl font-semibold text-white text-center px-20">
                {popupTranslations.popupTitle}
              </div>
              <div className="bg-nh-bgdark rounded-lg py-7 px-6 mt-9 mx-10">
                <div className="text-white">{popupTranslations.formTitle}</div>
                <input
                  placeholder="Wallet Address"
                  value={playerB}
                  onChange={(e) => setPlayerB(e.target.value)}
                  type="text"
                  className="bg-nh-gray rounded-md text-sm leading-6 p-2 text-white w-full mt-1"
                />
                <div className="pt-4 w-full">
                  <button
                    className="bg-nh-purple roudned-lg py-2 px-10 flex items-center justify-center rounded-lg w-full"
                    onClick={() => startGame()}
                  >
                    <span className="text-white text-sm leading-5 font-medium">
                      {popupTranslations.buttonText}
                    </span>
                  </button>
                </div>
                <Link href="/">
                  <div className="text-white text-center text-sm mt-4 hover:text-nh-text-3 cursor-pointer">
                    {popupTranslations.closeButtonText}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
