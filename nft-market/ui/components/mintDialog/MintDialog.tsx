import { mintAssetToNft } from "@/utils/callMethods";
import checkCorrectUrl from "@/utils/tests/checkCorrectUrl";
import { WalletConnection } from "calimero-sdk";
import { useState } from "react";
import translations from "../../constants/en.global.json";
import MintUnsuccessfulDialog from "../mintUnsuccessfulDialog/MintUnsuccessfulDialog";

interface NftForm {
  title: string;
  description: string;
  media: string;
}

interface MintDialogProps {
  walletConnectionObject: WalletConnection | undefined;
}

export default function MintDialog({
  walletConnectionObject,
}: MintDialogProps) {
  const [titleBlank, setTitleBlank] = useState("");
  const [descriptionBlank, setdescriptionBlank] = useState("");
  const [unvalidUrl, setUnvalidUrl] = useState("");
  const [nftForm, setNftForm] = useState<NftForm>({
    title: "",
    description: "",
    media: "",
  });
  const [errorDialog, setErrorDialog] = useState(false);

  const handleClose = () => {
    setErrorDialog(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { title, description, media } = nftForm;
    !media
      ? setUnvalidUrl("URL cannot be blank!")
      : !checkCorrectUrl(media) && setUnvalidUrl("Provided URL is invalid!");
    !title && setTitleBlank("Title cannot be blank!");
    !description && setdescriptionBlank("Description cannot be blank!");
    if (title && description && checkCorrectUrl(media)) {
      try {
        await mintAssetToNft(walletConnectionObject, title, description, media);
      } catch (error) {
        setErrorDialog(true);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleBlank("");
    setdescriptionBlank("");
    setUnvalidUrl("");
    const { name, value } = event.target;
    setNftForm({ ...nftForm, [name]: value });
  };

  return (
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
            {titleBlank && (
              <p className="text-red-500 text-sm text-center">{titleBlank}</p>
            )}
            <input
              type="text"
              name="description"
              value={nftForm.description}
              onChange={handleInputChange}
              className="text-black text-center rounded-xl h-8 focus:outline-none"
              placeholder="Description"
            />
            {descriptionBlank && (
              <p className="text-red-500 text-sm text-center">
                {descriptionBlank}
              </p>
            )}
            <input
              type="text"
              name="media"
              value={nftForm.media}
              onChange={handleInputChange}
              className="text-black text-center rounded-xl h-8 focus:outline-none"
              placeholder="Image URL"
            />
            {unvalidUrl && (
              <p className="text-red-500 text-sm text-center">{unvalidUrl}</p>
            )}
          </div>
          <div className="flex justify-center w-full mt-6">
            <button
              className="bg-nh-purple hover:bg-nh-purple-highlight h-10 w-full rounded-xl"
              title={translations.mint.buttonDescription}
            >
              {translations.mint.button}
            </button>
          </div>
        </form>
      </div>
      {errorDialog && <MintUnsuccessfulDialog onClose={handleClose} />}
    </div>
  );
}
