import Head from "next/head";
import { ReactNode } from "react";
import { RegisterStatus } from "../../../utils/useNear";
import LoginPopupComponent from "../loginComponent/LoginComponent";
import Navigation from "../navigation/Navigation";
import { SideNavigation } from "../sideNavigation/SideNavigation";

interface PageWrapperProps {
  isSignedIn: boolean;
  title: String;
  children: ReactNode;
  currentPage: string;
  nearLogin: () => void;
  nearLogout: () => void;
  calimeroLogout: () => void;
  gameRegister: () => void;
  status: RegisterStatus;
  setStatus: (status: RegisterStatus) => void;
  nearSignedIn: boolean;
  nearAccountId: string;
  accountId: string;
}

export default function PageWrapper({
  isSignedIn,
  title,
  children,
  currentPage,
  nearLogin,
  calimeroLogout,
  nearLogout,
  gameRegister,
  status,
  setStatus,
  nearSignedIn,
  nearAccountId,
  accountId,
}: PageWrapperProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col w-screen bg-nh-bglight items-center min-h-screen py-8">
        <div className="w-full max-w-nh">
          <Navigation
            nearLogout={nearLogout}
            calimeroLogout={calimeroLogout}
            gameRegister={gameRegister}
            status={status}
            setStatus={setStatus}
            nearSignedIn={nearSignedIn}
            nearAccountId={nearAccountId}
            accountId={accountId}
          />
        </div>
        {nearSignedIn ? (
          <div className="w-full max-w-nh flex">
            <div className="w-1/4">
              <SideNavigation menuPage={currentPage} />
            </div>
            <div className={`${isSignedIn ? "w-3/4" : "w-full"}`}>
              {children}
            </div>
          </div>
        ) : (
          <div className="w-full">
            <LoginPopupComponent login={nearLogin} />
          </div>
        )}
      </div>
    </>
  );
}
