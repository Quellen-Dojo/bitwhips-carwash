import { WalletContextState } from "@solana/wallet-adapter-react";
import React from "react";
import { useEffect, useState } from "react";
import { NFTMeta } from "../Home";
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

  const [nftData, setNFTData] = useState<Array<NFTMeta>>();
  const [_successTxn, setSuccessTxn] = props.successState;

  const [displayText, setDisplayText] = useState("Loading...");

  useEffect(() => {
    const fetchMetadataAndSetContext = async () => {
      infoNotif("Loading", "Getting your BitWhips...");
      try {
        const metadata: Array<NFTMeta> = await (
          await fetch(
            `${API_URL}/easygetallwhips?wallet=${props.wallet.publicKey!.toBase58()}&includeTopLevel=true`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          )
        ).json();
        setNFTData(metadata);
        if (metadata.length === 0) {
          setDisplayText("No valid BitWhips found!");
        }
      } catch {
        setDisplayText("Error with the server!");
      }
    };
    fetchMetadataAndSetContext();
  }, []);

  return (
    <div className="container">
      <div className="nftContainer">
        {!nftData || nftData.length === 0 ? (
          <h1>{displayText}</h1>
        ) : (
          nftData.map((v, k) => (
            <NFTImage
              successSetter={setSuccessTxn!}
              payForWash={props.payForWash}
              wallet={props.wallet}
              nftMetadata={v}
              key={k}
            />
          ))
        )}
      </div>
    </div>
  );
}
