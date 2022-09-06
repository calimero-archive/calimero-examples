import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {getCalimeroSdk} from "../wallet/WalletUtils";

const navigation = [
    {name: 'Home', href: '/', current: true},
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

interface PlatformMenuProps {
    loggedIn: boolean;
}

export default function PlatformMenu({loggedIn}: PlatformMenuProps) {
    const router = useRouter();
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between ">
                <div className="flex w-full ">
                    <div className="flex flex-shrink-0 items-center">
                        <img
                            className="block h-8 w-auto lg:hidden"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                        />
                        <img
                            className="hidden h-8 w-auto lg:block"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                        />
                    </div>
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex w-full sm:space-x-8 mx-auto items-center">
                        <div className="flex">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        item.current
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                        {loggedIn &&
                            <div className="flex justify-end w-full">
                                <button
                                    type="button"
                                    className="justify-end item-end bg-white text-black px-4 py-2 flex items-center h-[32px] rounded-md text-tiny font-medium font-inter hover:bg-[#5555FF] hover:text-white transition duration-1000"
                                    onClick={() => getCalimeroSdk().signOut()}>
                                    Sign out
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};;