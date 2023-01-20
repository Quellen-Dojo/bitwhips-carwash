import { WalletContextState } from "@solana/wallet-adapter-react";
import React from "react";
import { useCallback, useContext } from "react";
import { NFTMeta } from "../Home";
import { LoadingContext } from "../LoadingState";
import { API_URL } from "../utils/constants";
import determineCarType from "../utils/determineCarType";
import { errorNotif, infoNotif } from "../utils/notifications";

export function NFTImage(props: {
  nftMetadata: NFTMeta;
  payForWash: () => Promise<string>;
  wallet: WalletContextState;
  successSetter: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useContext(LoadingContext);

  const submitNFTToWash = useCallback(async () => {
    //@ts-ignore
    setLoading(true);
    try {
      try {
        const pingres = await fetch(`${API_URL}/ping`, { method: "GET" });
      } catch {
        errorNotif(
          "ERROR",
          "The server did not respond. Please try again later!"
        );
        return;
      }
      infoNotif("Confirming", "Waiting for transaction confirmation");
      const sig = await props.payForWash();
      // const sig = true;
      if (sig) {
        try {
          const processRes = await fetch(`${API_URL}/processcarwash`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              signature: sig,
              nft: props.nftMetadata,
              type: determineCarType(props.nftMetadata.symbol),
              fromWallet: props.wallet.publicKey!.toBase58(),
            }),
          });
          if (processRes.ok) {
            props.successSetter(true);
            setTimeout(() => (window.location.href = "/success"), 3000);
          } else {
            errorNotif("Error Processing Transaction", "Please try again!");
          }
        } catch (submitError) {
          console.log(submitError);
          errorNotif("Error", submitError.message);
        }
      }
    } catch (txnError) {
      errorNotif("Error!", txnError.message);
    }
    //@ts-ignore
    setLoading(false);
  }, []);
  return (
    <div style={{ position: "relative" }}>
      <img
        className="nftImage"
        src={props.nftMetadata.image}
        onClick={submitNFTToWash}
      />
    </div>
  );
}
