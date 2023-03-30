import PageWrapper from "@/components/pageWrapper/PageWrapper";
import { mintAssetToNft } from "@/utils/mint";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import translations from "../constants/en.global.json";
import { config } from "../utils/calimeroSdk";

let walletConnectionObject: WalletConnection | undefined = undefined;

interface MintProps {
  walletConnection: WalletConnection | undefined;
}

interface NftForm {
  title: string;
  description: string;
  media: string;
}

export default function Mint({ walletConnection }: MintProps) {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accountId, setAccountId] = useState<string | null>("");
  const [mintVisible, setMintVisible] = useState(false);
  const [nftsVisible, setNftsVisible] = useState(false);
  const [nftsForSellVisible, setNftsForSellVisible] = useState(false);

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
  const [nftForm, setNftForm] = useState<NftForm>({
    title: "",
    description: "",
    media: "",
  });

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNftForm({ ...nftForm, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log(walletConnectionObject);

    event.preventDefault();
    const { title, description, media } = nftForm;
    await mintAssetToNft(walletConnectionObject, title, description, media);
  };

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
      openMint={true}
    >
      <div className="flex justify-center text-white">
        <div className="bg-nh-gray flex flex-col justify-center p-4 gap-6 w-2/4 rounded-xl">
          <form onSubmit={handleSubmit}>
            <h1 className="flex justify-center">{translations.mint.title}</h1>
            <div className="flex flex-col justify-center gap-2 mt-6">
              <input
                type="text"
                name="title"
                value={nftForm.title}
                onChange={handleInputChange}
                className="text-black text-center rounded-xl h-8 focus:outline-none"
                placeholder="Title"
              />
              <input
                type="text"
                name="description"
                value={nftForm.description}
                onChange={handleInputChange}
                className="text-black text-center rounded-xl h-8 focus:outline-none"
                placeholder="Description"
              />
              <input
                type="text"
                name="media"
                value={nftForm.media}
                onChange={handleInputChange}
                className="text-black text-center rounded-xl h-8 focus:outline-none"
                placeholder="Image URL"
              />
            </div>
            <div className="flex justify-center w-full mt-6">
              <button className="bg-nh-purple hover:bg-nh-purple-highlight h-10 w-full rounded-xl">
                {translations.mint.button}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
