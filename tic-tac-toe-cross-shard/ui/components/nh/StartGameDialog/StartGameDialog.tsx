import { CheckCircleIcon } from "@heroicons/react/outline";
import { RegisterStatus } from "../../../utils/useNear";
import { PopupContainer } from "../popContainer/PopupContainer";
import Spinner from "../spinner/Spinner";

interface StartGameDialogProps {
  status: RegisterStatus;
  onClose: () => void;
}

export default function StartGameDialog({
  status,
  onClose,
}: StartGameDialogProps) {
  return (
    <PopupContainer>
      <div className="max-w-xl bg-nh-bglight rounded-2xl px-6 py-5 relative flex flex-col w-96">
        <div className="flex justify-center py-4 text-center">
          <div>
            <p className="text-lg text-white">Starting New Game</p>
            {status.loading ?  (
              <>
                <div className="flex justify-center mt-4">
                    <div className="flex justify-center items-center pb-4">
                      <Spinner />
                    </div>
                </div>
                <p className="text-white mt-2">
                  Sending your request to blockchain
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center mt-4">
                  <CheckCircleIcon className="w-10 h-10 text-nh-green" />
                </div>
                <p className="text-md text-nh-green">
                  You have registered to a new game, please wait for another
                  player to register in order to play.
                </p>
              </>
            )}
          </div>
        </div>
        {!status.loading && <div className="flex justify-center items-center">
              <button className="mt-6 mb-2 text-black bg-white px-4 py-2 hover:bg-nh-purple w-32 rounded-md" onClick={onClose}>
          Continue
        </button>
        </div>}
      </div>
    </PopupContainer>
  );
}
