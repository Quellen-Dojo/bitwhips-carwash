import { WalletContextState } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { NFTMeta } from "../Home";
import { allowedModels, blockedAttr } from "../utils/blockedAttributes";
import { API_URL } from "../utils/constants";
import { infoNotif } from "../utils/notifications";
import { NFTImage } from "./NFTImage";

export function NFTDisplay(props: {
  wallet: WalletContextState;
  payForWash: () => Promise<string>;
  processing:
    | [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    | [undefined, undefined];
  successState:
    | [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    | [undefined, undefined];
}) {
  const filterNonCleaned = (metadataArray: Array<NFTMeta>) => {
    const cleanedInAttributes = (
      attrs: { trait_type: string; value: string }[]
    ) => {
      for (const attr of attrs) {
        if (attr.trait_type === "Washed" || blockedAttr.includes(attr.value)) {
          console.log(`Found one ${attr.value}`);
          return true;
        }
      }
      return false;
    };

    return metadataArray.filter((v) => !cleanedInAttributes(v.attributes));
  };

  const filterDisallowedModels = (metadataArray: Array<NFTMeta>) => {
    return metadataArray.filter((v) => allowedModels.includes(v.symbol));
  };

  const isEmpty = (array: Array<any>) => {
    if (array) {
      return array.length === 0;
    } else {
      return true;
    }
  };

  const [nftData, setNFTData] = useState<Array<NFTMeta>>([]);
  const [successTxn, setSuccessTxn] = props.successState;

  const [fetchWhipError, setFetchError] = useState(false);

  const [filteredWhips, setFilteredWhips] = useState<Array<NFTMeta>>([]);

  useEffect(() => {
    const fetchMetadataAndSetContext = async () => {
      infoNotif("Loading", "Getting your BitWhips...");
      try {
        const metadata = await (
          await fetch(
            `${API_URL}/easygetallwhips?wallet=${props.wallet.publicKey!.toBase58()}&includeTopLevel=true`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          )
        ).json();
        setNFTData(metadata);
        setFilteredWhips(filterNonCleaned(filterDisallowedModels(metadata)));
      } catch {
        setFetchError(true);
      }
    };
    fetchMetadataAndSetContext();
  }, []);

  return (
    <div className="container">
      {nftData.length > 0 && (
        <div className="nftContainer">
          {!isEmpty(filteredWhips) &&
            filteredWhips.map((v, k) => (
              <NFTImage
                successSetter={setSuccessTxn!}
                payForWash={props.payForWash}
                wallet={props.wallet}
                nftMetadata={v}
                key={k}
              />
            ))}
          {isEmpty(filteredWhips) && (
            <h1 style={{ color: "white" }}>No valid BitWhips detected!</h1>
          )}
        </div>
      )}
      {nftData.length === 0 && (
        <div className="nftContainer">
          {fetchWhipError ? (
            <h1 style={{ color: "white" }}>Error! Please try again!</h1>
          ) : (
            <h1 style={{ color: "white" }}>Loading...</h1>
          )}
        </div>
      )}
    </div>
  );
}
