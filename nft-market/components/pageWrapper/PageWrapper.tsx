import Head from "next/head";
import { ReactNode } from "react";
import Navigation from "../Navigation/Navigation";

interface PageWrapperProps {
  isSignedIn: boolean;
  title: String;
  children: ReactNode;
  nearLogin: () => void;
  nearLogout: () => void;
  nearSignedIn: boolean;
  mintVisible: () => void;
  nftsVisible: () => void;
}

export default function PageWrapper({
  isSignedIn,
  title,
  children,
  nearLogin,
  nearLogout,
  nearSignedIn,
  mintVisible,
  nftsVisible
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
            isSignedIn={isSignedIn} 
            nearLogin={nearLogin}
            nearLogout={nearLogout}
            nearSignedIn={nearSignedIn}
            mintVisible={mintVisible}
            nftsVisible={nftsVisible}
          />
        </div>
        {nearSignedIn && (
          <div className="w-full max-w-nh flex">
            
            <div className={`${isSignedIn ? "w-3/4" : "w-full"}`}>
              {children}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
