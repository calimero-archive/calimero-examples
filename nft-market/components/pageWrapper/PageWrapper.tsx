import Head from "next/head";
import { ReactNode } from "react";
import LoginPopupComponent from "../loginComponent/LoginComponent";
import Navigation from "../navigation/Navigation";

interface PageWrapperProps {
  isSignedIn: boolean;
  title: String;
  children?: ReactNode;
  nearLogin: () => void;
  nearLogout: () => void;
  nearSignedIn: boolean;
  openMint?: boolean;
  openBuy?: boolean;
  openMyNft?: boolean;
}

export default function PageWrapper({
  isSignedIn,
  title,
  children,
  nearLogin,
  nearLogout,
  nearSignedIn,
  openMint,
  openBuy,
  openMyNft,
}: PageWrapperProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/calimero.svg" />
      </Head>
      <div className="flex flex-col w-screen bg-nh-bglight items-center min-h-screen py-6">
        <div className="w-full max-w-nh">
          <Navigation
            isSignedIn={isSignedIn}
            nearLogin={nearLogin}
            nearLogout={nearLogout}
            nearSignedIn={nearSignedIn}
            openMint={openMint}
            openMyNft={openMyNft}
            openBuy={openBuy}
          />
        </div>
        {nearSignedIn ? (
          <div className="w-full max-w-nh flex justify-center">
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
