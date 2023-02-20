import Head from "next/head";
import { ReactNode } from "react";
import LoginPopupComponent from "../loginComponent/LoginComponent";
import Navigation from "../navigation/Navigation";
import useCalimero from "../../../hooks/useCalimero";

interface PageWrapperProps {
  title: String;
  children: ReactNode;
}

export default function PageWrapper({
  title,
  children,
}: PageWrapperProps) {
  const { isSignedIn, walletConnectionObject } = useCalimero();

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col w-screen bg-nh-bglight items-center min-h-screen py-8">
        <div className="w-full max-w-nh">
          <Navigation walletConnection={walletConnectionObject} />
        </div>
        {!isSignedIn ? (
          <div className="w-full max-w-nh flex">
            <div className={`${!isSignedIn ? "w-3/4" : "w-full"}`}>
              {children}
            </div>
          </div>
        ) : (
          <div className="w-full">
            <LoginPopupComponent
              login={async () => walletConnectionObject?.requestSignIn({})}
            />
          </div>
        )}
      </div>
    </>
  );
}
