import { mintAssetToNft, displayAllNFT } from "@/utils/mint";
import { WalletConnection } from "near-api-js";
import { useState } from "react";
import translations from "../../constants/en.global.json";

interface MintProps {
    walletConnection: WalletConnection | undefined;
}

interface NftForm {
    title: string,
    description: string,
    media: string,
}

export default function Mint({ walletConnection }: MintProps) {
    const [nftForm, setNftForm] = useState<NftForm>({
        title: '',
        description: '',
        media: ''
      });
    
      const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNftForm({ ...nftForm, [name]: value });
      };
    
      const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(nftForm);
        const { title, description, media } = nftForm;
        mintAssetToNft(walletConnection, title, description, media);
      };

      

    return (
        <div className="flex justify-center text-white">
            <div className="bg-nh-gray flex flex-col justify-center p-4 gap-6 w-2/4 rounded-xl">
                <form 
                    onSubmit={handleSubmit}
                >
                    <h1 className="flex justify-center">
                        {translations.mint.title}
                    </h1>
                    <div className="flex flex-col justify-center gap-2 mt-6">
                        <input type="text" name="title" value={nftForm.title} onChange={handleInputChange}
                        className="text-black text-center rounded-xl h-8 focus:outline-none" placeholder="Title"/>
                    
                        <input type="text" name="description" value={nftForm.description} onChange={handleInputChange}
                        className="text-black text-center rounded-xl h-8 focus:outline-none" placeholder="Description"/>
                    
                        <input type="text" name="media" value={nftForm.media} onChange={handleInputChange}
                        className="text-black text-center rounded-xl h-8 focus:outline-none" placeholder="Image URL"/>
                    </div>
                    <div className="flex justify-center w-full mt-6">
                        <button className="bg-nh-purple hover:bg-nh-purple-highlight h-10 w-full rounded-xl">
                            {translations.mint.button}
                        </button>
                    </div> 
                </form>              
            </div>
        </div>
    )
}