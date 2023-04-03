import { useRouter } from "next/router";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import { useEffect, useState } from "react";
import translations from "../constants/en.global.json";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { config } from "../utils/calimeroSdk";

let walletConnectionObject: WalletConnection | undefined = undefined;

export default function Home() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accountId, setAccountId] = useState<string | null>("");

  const login = async () => {
    await walletConnectionObject?.requestSignIn({
      contractId: config.nftContract,
    });
  };

  const logout = () => {
    walletConnectionObject?.signOut();
    setIsSignedIn(false);
  };

  useEffect(() => {
    if (isSignedIn && localStorage.getItem("accountId")) {
      setAccountId(localStorage.getItem("accountId"));
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(
        calimero,
        config.nftContract
      );
      const signedIn = await walletConnectionObject?.isSignedInAsync();
      const account = walletConnectionObject?.account();
      if (account && signedIn) {
        localStorage.setItem("accountId", account.accountId);
      }
      setIsSignedIn(signedIn);
    };
    init();
  }, []);

  useEffect(() => {
    const absolute = window.location.href.split("?");
    const url = absolute[0];
    router.replace(url);
  }, []);

  return (
    <PageWrapper
      isSignedIn={isSignedIn}
      title={translations.home.title}
      nearLogin={login}
      nearLogout={() => {
        logout();
        router.reload();
      }}
      nearSignedIn={isSignedIn}
    >
      <div className="text-white flex flex-col gap-2">
        <div className="flex flex-col text-right">
          <h1 className="text-5xl">{translations.homePage.welcomeText1}</h1>
          <h1 className="text-5xl text-nh-purple">
            {translations.homePage.welcomeText2}
          </h1>
          <h1 className="text-5xl">{translations.homePage.welcomeText3}</h1>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-nh-purple">
            <div>O{translations.homePage.paragraph1}</div>
            <div>
              <img
                src="https://storage.googleapis.com/calimero-image-storage-bucket/assets/calimero_private_shard_image.png"
                alt="first"
              ></img>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <img
                src="https://storage.googleapis.com/calimero-image-storage-bucket/assets/calimero_interoperability_feature_shards.png"
                alt="second"
              />
            </div>
            <div>{translations.homePage.paragraph2}</div>
          </div>
        </div>
        <div className="flex text-3xl mt-10 text-nh-purple">
          <div>{translations.homePage.paragraph3}</div>
        </div>
      </div>
    </PageWrapper>
  );
}
