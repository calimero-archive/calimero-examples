import { CheckCircleIcon } from "@heroicons/react/outline";
import { RegisterStatus } from "../../../utils/useNear";
import { PopupContainer } from "../popContainer/PopupContainer";
import Spinner from "../spinner/Spinner";
import translations from "../../../constants/en.global.json";

interface StartGameDialogProps {
  status: RegisterStatus;
  onClose: () => void;
}

export default function StartGameDialog({
  status,
  onClose,
}: StartGameDialogProps) {
  const translation = translations.startGameDialog;
  return (
    <PopupContainer>
      <div className="max-w-xl bg-nh-bglight rounded-2xl px-6 py-5 relative flex flex-col w-96">
        <div className="flex justify-center py-4 text-center">
          <div>
            <p className="text-lg text-white">{translation.title}</p>
            {status.loading ? (
              <>
                <div className="flex justify-center mt-4">
                  <div className="flex justify-center items-center pb-4">
                    <Spinner />
                  </div>
                </div>
                <p className="text-white mt-2">{translation.subtitle}</p>
              </>
            ) : (
              <>
                <div className="flex justify-center mt-4">
                  <CheckCircleIcon className="w-10 h-10 text-nh-green" />
                </div>
                <p className="text-md text-nh-green">
                  {translation.description}
                </p>
              </>
            )}
          </div>
        </div>
        {!status.loading && (
          <div className="flex justify-center items-center">
            <button
              className="mt-6 mb-2 text-black bg-white px-4 py-2 hover:bg-nh-purple w-32 rounded-md"
              onClick={onClose}
            >
              {translation.buttonText}
            </button>
          </div>
        )}
      </div>
    </PopupContainer>
  );
}
