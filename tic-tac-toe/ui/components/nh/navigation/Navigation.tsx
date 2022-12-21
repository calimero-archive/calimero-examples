import CalimeroLogo from "../images/CalimeroLogo";
import TictactoeLogo from "../images/TictactoeLogo";

export default function Navigation() {
  const calimeroSdkSignout = () => {
    console.log("Sign out");
  };

  return (
    <div className="flex justify-between">
      <div className="h-full bg-nh-bglight flex divide-x-2">
        <div className="pl-2 pr-4">
          <CalimeroLogo size="navbar" />
        </div>
        <div className="pt-2 pl-5">
          <TictactoeLogo size="navbar" />
        </div>
      </div>
      <div
        className="text-white hover:text-nh-purple text-base leading-6 
        font-medium flex items-center cursor-pointer"
        onClick={() => calimeroSdkSignout()}
      >
        fran.calimero.testnet
      </div>
    </div>
  );
}
