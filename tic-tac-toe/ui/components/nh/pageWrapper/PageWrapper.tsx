import Head from "next/head";
import { ReactNode } from "react";
import Navigation from "../navigation/Navigation";
import { SideNavigation } from "../sideNavigation/SideNavigation";

interface PageWrapperProps {
  currentPage: string;
  title: String;
  children: ReactNode;
}

export default function PageWrapper({
  currentPage,
  title,
  children,
}: PageWrapperProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col w-screen bg-nh-bglight items-center min-h-screen py-8">
        <div className="w-full max-w-nh">
          <Navigation />
        </div>
        <div className="w-full max-w-nh flex">
          <div className="w-1/4">
            <SideNavigation menuPage={currentPage} />
          </div>
          <div className="w-3/4">{children}</div>
        </div>
      </div>
    </>
  );
}
