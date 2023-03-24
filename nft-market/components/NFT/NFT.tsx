import Image from "next/image";
import translations from "../../constants/en.global.json";

interface Metadata {
    description: string,
    media: string,
    title: string,
}

export interface NFTProps {
    metadata: Metadata,
    owner_id: string,
    token_id: string,
}

export default function NFT({ metadata, owner_id, token_id }: NFTProps) {
    return (
        <div className="flex flex-col justify-center bg-nh-purple-disabled rounded w-fit p-1">
            <div>
                <Image 
                    src={metadata.media} 
                    alt="nft" 
                    height={400} 
                    width={320}
                    className="rounded"
                />
            </div>
            <div className="flex justify-center">
                <h1>{metadata.title}</h1>
            </div>
            <div>
                <h3>{metadata.description}</h3>
            </div>
            <div className="flex justify-center mt-4">
                <button className="bg-white hover:bg-nh-text w-full p-2 text-black rounded">
                    {translations.nft.button}
                </button>
            </div>
        </div>
    )
}