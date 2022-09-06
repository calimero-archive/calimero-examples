import React from "react";


interface LoginProps{
    onClick:()=>void
}

export default function LoginWithNear({onClick}:LoginProps) {
    return (
        <div className="flex justify-center mt-8">
            <button
                type="button"
                className="bg-white text-black px-4 py-2 flex items-center h-[32px] rounded-md text-tiny font-medium font-inter hover:bg-[#5555FF] hover:text-white transition duration-1000"
                onClick={onClick}>
                Login with NEAR
            </button>
        </div>
    );
}