import { PopupContainer } from "../popContainer/PopupContainer";
import translations from "../../constants/en.global.json";
import { useState } from "react";
import Close from "../closeButton/CloseButton";
import { WalletConnection } from "calimero-sdk";
import { setNftForSale } from "@/utils/callMethods";

interface SellNftDialogProps {
  onClose: () => void | undefined;
  walletConnection: WalletConnection | undefined;
  token_id: string;
}

export default function SellNftDialog({
  onClose,
  walletConnection,
  token_id,
}: SellNftDialogProps) {
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const handlePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const { value } = event.target;
    setPrice(value);
  };

  return (
    <PopupContainer>
      <div className="max-w-xl bg-nh-bglight rounded-2xl px-3 pb-5 pt-3 relative flex flex-col w-96">
        <div className="flex justify-end">
          <Close onClose={onClose} />
        </div>
        <div className="flex justify-center py-2 text-center">
          <div>
            <p className="text-lg text-nh-purple">
              {translations.sellNftDialog.title}
            </p>
            <div className="flex justify-center mt-4"></div>
            <input
              type="number"
              placeholder="Enter amount"
              className="p-2 text-center w-64 rounded-md focus:outline-none border text-nh-bglight placeholder-nh-text-1"
              value={price}
              onChange={handlePrice}
            ></input>
            {error && (
              <p className="text-red-500 text-sm text-center mt-1">{error}</p>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="mt-6 mb-2 text-black hover:bg-nh-purple-highlight px-4 py-2 bg-nh-purple w-32 rounded-md"
            onClick={async () => {
              try {
                setNftForSale(walletConnection, token_id, price);
              } catch (error) {
                setError("Invalid amount");
              }
            }}
          >
            {translations.sellNftDialog.button}
          </button>
        </div>
      </div>
    </PopupContainer>
  );
}
