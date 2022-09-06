import {useRouter} from "next/router";
import React from "react";

import {BuildingStorefrontIcon, QueueListIcon, UserIcon} from '@heroicons/react/24/solid';

export default function Home() {
    const router = useRouter();
    return (
        <div>
            <div className="px-4 py-8 sm:px-0 w-full h-screen " >
                <div className="grid justify-center h-fill gap-4 space-y-2  m-auto">

                    <text className="text-5xl font-mono mb-24">  Select App</text>

                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                        onClick={() => router.replace("/government")}>
                        <BuildingStorefrontIcon className="h-8 w-8 m-auto text-white justify-center items-center" />
                        Government App
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => router.replace("/user")}>
                        <UserIcon className="h-8 w-8 m-auto text-white justify-center items-center" />
                        User Private App
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => router.replace("/marketplace")}>
                        <QueueListIcon className="h-8 w-8 m-auto text-white justify-center items-center" />
                        Marketplace App
                    </button>
                </div>
            </div>
        </div>
    );
}
