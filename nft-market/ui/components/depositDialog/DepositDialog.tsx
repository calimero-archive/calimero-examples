import { PopupContainer } from "../popContainer/PopupContainer";
import translations from "../../constants/en.global.json";
import Close from "../closeButton/CloseButton";
import { WalletConnection } from "calimero-sdk";
import * as nearAPI from "near-api-js";
import { config } from "../../utils/calimeroSdk";

interface CantBuyYourOwnNftDialogProps {
  onClose: () => void | undefined;
  walletConnectionObject: WalletConnection | undefined;
}

interface MyContract extends nearAPI.Contract {
  storage_deposit(options: any, gas: number, amount: string): Promise<any>;
}

export default function CantBuyYourOwnNftDialog({
  onClose,
  walletConnectionObject,
}: CantBuyYourOwnNftDialogProps) {
  const depositStorage = async () => {
    if (walletConnectionObject) {
      const contract = new nearAPI.Contract(
        walletConnectionObject.account(),
        config.marketContract,
        {
          changeMethods: ["storage_deposit"],
          viewMethods: [],
        }
      ) as MyContract;
      try {
        const res = await contract["storage_deposit"](
          {},
          30000000000000, // attached gas
          nearAPI.utils.format.parseNearAmount("1") ?? "1"
        );
      } catch (e) {
        console.log(e);
      }
    }
  };
  return (
    <PopupContainer>
      <div className="max-w-xl bg-nh-bglight rounded-2xl px-3 pb-5 pt-3 relative flex flex-col w-2/6">
        <div className="flex justify-end">
          <Close onClose={onClose} />
        </div>
        <div className="flex flex-col px-2 text-center my-4">
          <p className="text-lg text-left text-white">
            {translations.mynft.depositText1}
          </p>
          <p className="text-lg text-left text-white">
            {translations.mynft.depositText2}
          </p>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="mt-2 mb-2 text-black hover:bg-nh-purple-highlight px-4 py-2 bg-nh-purple w-32 rounded-md"
            onClick={depositStorage}
          >
            {translations.mynft.deposit}
          </button>
        </div>
      </div>
    </PopupContainer>
  );
}
