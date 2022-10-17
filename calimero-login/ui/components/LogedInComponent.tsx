import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoMD } from "../const/svg/LogoMD";

export default function LogedInComponent() {
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    let signedUser = localStorage.getItem("account_id");
    setUser(signedUser);
  }, []);
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
          {user && <p>Logged in successfully! Welcome {user}</p>}
        </div>
      </div>
    </div>
  );
}
