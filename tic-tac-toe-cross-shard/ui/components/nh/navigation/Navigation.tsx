import { useEffect, useState } from "react";
import { RegisterStatus } from "../../../utils/useNear";
import CalimeroLogo from "../images/CalimeroLogo";
import NearLogo from "../images/NearLogo";
import TictactoeLogo from "../images/TictactoeLogo";
import StartGameDialog from "../StartGameDialog/StartGameDialog";

interface NavigationProps {
  isSignedIn: boolean;
  nearLogin: () => void;
  nearLogout: () => void;
  gameRegister: () => void;
  status: RegisterStatus;
  setStatus: (status: RegisterStatus) => void;
  nearSignedIn: boolean;
}

export default function Navigation({
  isSignedIn,
  nearLogin,
  nearLogout,
  gameRegister,
  status,
  setStatus,
  nearSignedIn,
}: NavigationProps) {
  const [accountId, setAccountId] = useState("");
  const [nearAccountId, setNearAccountId] = useState("");

  useEffect(() => {
    const account = localStorage.getItem("accountId");
    setAccountId(account || "");
    const nearAccount = localStorage.getItem("nearAccountId");
    setNearAccountId(nearAccount || "");
  }, [isSignedIn, nearSignedIn]);

  return (
    <div className="flex justify-between">
      <div className="h-full bg-nh-bglight flex divide-x-2">
        <div className="pl-2 pr-4">
          <CalimeroLogo size="navbar" />
        </div>
        <div className="pt-2 pl-5">
          <TictactoeLogo size="navbar" />
        </div>
      </div>
      {nearSignedIn && (
        <>
          {!nearSignedIn ? (
            <button
              className="bg-white roudned-lg py-3 gap-x-4 px-10 flex items-center text-nh-bglight rounded-lg hover:bg-nh-purple"
              onClick={nearLogin}
            >
              <NearLogo />
              <span className="text-base leading-6 font-medium">
                Login NEAR testnet
              </span>
            </button>
          ) : (
            <button
              className="bg-white roudned-lg py-3 gap-x-4 px-10 flex items-center
         text-nh-bglight rounded-lg hover:bg-nh-purple"
              onClick={gameRegister}
            >
              Start new Game
            </button>
          )}
          {status.started && (
            <StartGameDialog
              status={status}
              onClose={() =>
                setStatus({
                  started: false,
                  loading: false,
                })
              }
            />
          )}
          <div>
            <div
              className="text-white hover:text-nh-purple text-base leading-6 
        font-medium flex items-center cursor-pointer"
              onClick={nearLogout}
            >
              Near Account: {nearAccountId}
            </div>
            <div
              className="text-white hover:text-nh-purple text-base leading-6 
        font-medium flex items-center cursor-pointer"
            >
              Calimero Account: {accountId}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
