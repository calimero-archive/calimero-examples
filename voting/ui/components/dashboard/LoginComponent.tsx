import Link from "next/link";
import { LogoMD } from "../../const/svg/LogoMD";

export default function LoginComponent() {
  return (
    <div className="w-full bg-white flex justify-center">
      <div className="bg-black shadow-2xl mt-10 px-8 py-8 w-2/3 rounded-md">
        <div>
          <Link href="/">
            <div className="cursor-pointer">
              <LogoMD />
            </div>
          </Link>
        </div>
        <div className="text-white mt-4 ml-6">
          <p>Please Login with your wallet to see the poll!</p>
        </div>
      </div>
    </div>
  );
}
