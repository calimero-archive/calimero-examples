import Head from "next/head";
import { ReactNode } from "react";
import LoginPopupComponent from "../loginComponent/LoginComponent";
import Navigation from "../navigation/Navigation";


interface PageWrapperProps {
  signIn: () => void;
  isSignedIn: boolean;
  signOut: () => void;
  title: String;
  children: ReactNode;
}

export default function PageWrapper({
  signIn,
  isSignedIn,
  signOut,
  title,
  children
}: PageWrapperProps) {
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col w-screen bg-nh-bglight items-center min-h-screen py-8">
        <div className="w-full max-w-nh">
          <Navigation isSignedIn={isSignedIn} signOut={signOut} />
        </div>
        {isSignedIn ? (
          <div className="w-full justify-center flex">
            <div className={`${isSignedIn ? "w-3/4" : "w-full"}`}>
              {children}
            </div>
          </div>
        ) : (
          <div className="w-full">
            <LoginPopupComponent
              login={signIn}
            />
          </div>
        )}
      </div>
    </>
  );
}
