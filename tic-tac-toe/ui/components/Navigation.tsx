import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { Logo } from "../const/svg/LogoXS";
import { LogoMD } from "../const/svg/LogoMD";
import { GithubIcon } from "../const/svg/GithubIcon";
import { TwitterIcon } from "../const/svg/TwitterIcon";
import { LinkedinIcon } from "../const/svg/LinkedinIcon";
import Dropdown from "./dropdown/Dropdown";
import calimeroSdk from "../utils/calimeroSdk";
import { useEffect } from "react";

function classNames({ classes = [] }: { classes?: any[] } = {}) {
  return classes.filter(Boolean).join(" ");
}

function getNavigationMap(pathname: string) {
  let navigationMenuItem = "/" + pathname.split("/")[1];
  if (navigationMenuItem === "/settings") {
    navigationMenuItem = "/settings/account";
  }
  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      current: false,
      outer: false,
      drop: false,
      subitems: undefined,
    },
    {
      name: "Community",
      href: "/community",
      current: false,
      outer: false,
      drop: true,
      subitems: [
        {
          name: "Twitter",
          href: "https://twitter.com/CalimeroNetwork",
          icon: TwitterIcon,
        },
        {
          name: "Linkedin",
          href: "https://www.linkedin.com/company/calimero-network/mycompany/",
          icon: LinkedinIcon,
        },
        {
          name: "Github",
          href: "https://github.com/calimero-is-near",
          icon: GithubIcon,
        },
      ],
    },
    {
      name: "Docs",
      href: "https://docs.calimero.network/",
      current: false,
      outer: true,
      subitems: undefined,
      drop: false,
    },
    {
      name: "Calimero",
      href: "https://alpha.app.calimero.network",
      current: false,
      outer: true,
      subitems: undefined,
      drop: false,
    },
  ];
  for (const navigationItem of navigation) {
    if (navigationItem.href == navigationMenuItem) {
      navigationItem.current = true;
    }
  }

  return navigation;
}

export default function MenuNavigation() {
  const { pathname } = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [buttonText, setButtonText] = useState<string>("");

  useEffect(() => {
    if (calimeroSdk.isSignedIn()) {
      setButtonText("Logout");
    } else {
      setButtonText("Login with NEAR");
    }
  }, []);
  const signIn = async () => {
    if (calimeroSdk.isSignedIn()) {
      await calimeroSdk.signOut();
    } else {
      const res = calimeroSdk.signIn();
      console.log("tu sam");
    }
  };
  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Dialog.Panel className="relative flex flex-col flex-1 bg-black">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute z-20 top-0 right-0 px-2 py-3">
                    <button
                      type="button"
                      className="ml-1 flex h-8 w-8 items-center justify-center rounded-full 
                        focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-700"
                      onClick={() => {
                        setSidebarOpen(false);
                      }}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="h-0 flex-1 overflow-y-auto pb-4">
                  <div className="flex flex-shrink-0 items-center px-4 mt-4">
                    <Link href="/">
                      <div>
                        <Logo />
                      </div>
                    </Link>
                  </div>

                  <nav className="mt-5 space-y-4 px-4 text-center">
                    {getNavigationMap(pathname).map((item, i) => {
                      if (item.subitems) {
                        return (
                          <div key={i + item.name}>
                            <Dropdown
                              dropdownItems={item.subitems}
                              title={item.name}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div key={i + item.name}>
                            {item.outer ? (
                              <a href={item.href}>
                                <div
                                  className={classNames({
                                    classes: [
                                      "group flex cursor-pointer py-2 justify-center items-center text-[#888888] text-tiny font-extralight font-inter  hover:text-white transition duration-700",
                                    ],
                                  })}
                                >
                                  {item.name}
                                </div>
                              </a>
                            ) : (
                              <Link href={item.href}>
                                <p
                                  className={`group flex cursor-pointer justify-center items-center text-[#888888] text-tiny font-extralight font-inter hover:text-white transition duration-700 ${
                                    item.current &&
                                    "border-b border-b-gray-50 py-2"
                                  }`}
                                >
                                  {item.name}
                                </p>
                              </Link>
                            )}
                          </div>
                        );
                      }
                    })}
                  </nav>
                  {
                    <div className="flex justify-center mt-8">
                      <button
                        type="button"
                        className="bg-white text-black px-4 py-2 flex items-center h-[32px] rounded-md text-tiny font-medium font-inter hover:bg-[#5555FF] hover:text-white transition duration-1000"
                        onClick={() => signIn()}
                      >
                        {buttonText}
                      </button>
                    </div>
                  }
                </div>
              </Dialog.Panel>

              <div className="w-0 flex-shrink-0"></div>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="hidden md:fixed md:flex md:justify-center items-center w-full  text-white py-4 bg-black md:px-10 xl:px-32 z-30">
          <div className="md:w-1/3 flex justify-left lg:justify-center">
            <Link href="/">
              <div className="cursor-pointer">
                <LogoMD />
              </div>
            </Link>
          </div>
          {/* MENU */}
          <div className="flex px-2 text-base font-medium font-inter cursor-pointer gap-4 lg:gap-12 md:w-1/3 justify-between">
            {getNavigationMap(pathname).map((item, i) => {
              if (item.drop) {
                return (
                  <div key={i + item.name}>
                    <Dropdown dropdownItems={item.subitems} title={item.name} />
                  </div>
                );
              } else {
                return (
                  <div key={i + item.name}>
                    {item.outer ? (
                      <a
                        href={item.href}
                        className={`group flex cursor-pointer items-center text-[#888888] text-tiny font-extralight font-inter py-2 hover:text-white transition duration-700 
                        `}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link href={item.href}>
                        <p
                          className={`pt-2 group flex cursor-pointer items-center text-[#888888] text-tiny font-extralight font-inter hover:text-white transition duration-700 ${
                            item.current && "border-b py-2 border-b-gray-50"
                          }`}
                        >
                          {item.name}
                        </p>
                      </Link>
                    )}
                  </div>
                );
              }
            })}
          </div>
          {/* MENU END */}

          <div className="md:w-1/3 flex justify-end lg:justify-center">
            <button
              type="button"
              className="bg-white text-black px-4 py-2 flex items-center h-[32px] rounded-md text-tiny font-medium font-inter hover:bg-[#5555FF] hover:text-white transition duration-1000"
              onClick={() => signIn()}
            >
              {buttonText}
            </button>
          </div>
        </div>

        <div className="sticky top-0 z-10 bg-black md:hidden flex items-center justify-between pb-4">
          <div className="flex flex-shrink-0 items-center px-4 mt-4">
            <Link href="/">
              <div>
                <Logo />
              </div>
            </Link>
          </div>
          <button
            type="button"
            className="cursor-pointer inline-flex h-6 w-6 items-center absolute right-3 top-4
              justify-center rounded-md text-white 
              focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-700"
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}
