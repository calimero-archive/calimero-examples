import { PopupContainer } from "../popContainer/PopupContainer";
import translations from "../../constants/en.global.json";
import Close from "../closeButton/CloseButton";

interface CantBuyYourOwnNftDialogProps {
  onClose: () => void;
}

export default function CantBuyYourOwnNftDialog({
  onClose,
}: CantBuyYourOwnNftDialogProps) {
  return (
    <PopupContainer>
      <div className="max-w-xl bg-nh-bglight rounded-2xl px-3 pb-5 pt-3 relative flex flex-col w-96">
        <div className="flex justify-end">
          <Close onClose={onClose} />
        </div>
        <div className="flex justify-center py-2 text-center my-4">
          <p className="text-lg text-red-500">
            {translations.cantBuyYourOwnNftDialog.text}
          </p>
        </div>
      </div>
    </PopupContainer>
  );
}
