/* eslint-disable react/jsx-no-comment-textnodes */
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
    try {
      await walletConnectionObject?.requestSignIn({
        contractId: config.nftContract,
      });
    } catch (error) {
      console.log(error);
    }
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
          <h1 className="text-5xl">Welcome to</h1>
          <h1 className="text-5xl text-nh-purple">the Calimero Network</h1>
          <h1 className="text-5xl">NFT Marketplace</h1>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-nh-purple">
            <div>
              Our example allows you to mint, sell, and buy tokens that are
              securely stored on our private shard. Private shards technology
              enables a more scalable and decentralized network, ensuring the
              safety and privacy of your transactions.
            </div>
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
            <div>
              With Calimero Network, you can create your own unique NFTs or
              browse our collection of curated NFTs. Whether you're interested
              in digital art, collectibles, or virtual real estate, our
              marketplace has something for everyone.
            </div>
          </div>
        </div>
        <div className="flex text-3xl mt-10 text-nh-purple">
          <div>
            Join our community of NFT enthusiasts and start minting, selling,
            and buying today!
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
