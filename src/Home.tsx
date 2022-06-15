import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import {
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { LoadingContext } from "./LoadingState";
import "antd/dist/antd.css";
import "./carwash.css";

//@ts-ignore
import bwLogo from "./images/bw_logo.png";
//@ts-ignore
import LoadingOverlay from "./LoadingOverlay";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { NFTDisplay } from "./components/NFTDisplay";
import { infoNotif } from "./utils/notifications";

const CLNT_ACCOUNT = new PublicKey(
  "H3WkH9HCWFP7jXN12RnJHZmis6ymv8yAx8jYQNTX4sHU"
);

const CLNT_MINT = new PublicKey("CLNTcXKJEqaiKZ53jMTXMuAnTmz7iULKPxSXy6aSaU66");

//Type
export type NFTMeta = {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
  mint: string;
};

function shortenAddress(addr: string, digits: number) {
  return addr.slice(0, digits) + "....." + addr.slice(-digits, addr.length);
}

export default function Home() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [successTxn, setSuccessTxn] = useState(false);

  const [highProcessing, setHighProcessing] = useContext(LoadingContext);

  const sendTxn = async () => {
    const txn = new Transaction();
    const ata = await getAssociatedTokenAddress(CLNT_MINT, wallet.publicKey!);
    txn.add(
      createTransferInstruction(
        ata,
        CLNT_ACCOUNT,
        wallet.publicKey!,
        100 * 10 ** 9
      )
    );
    const sig = await wallet.sendTransaction(txn, connection);
    console.log(`Signature: ${sig}`);
    return sig;
  };

  useEffect(() => {
    if (highProcessing) {
      ReactDOM.render(
        <LoadingOverlay successTxn={successTxn} />,
        document.getElementById("overlay")
      );
    } else {
      ReactDOM.unmountComponentAtNode(document.getElementById("overlay"));
    }
    return () => {
      ReactDOM.unmountComponentAtNode(document.getElementById("overlay"));
    };
  }, [highProcessing]);

  return (
    <div>
      {!wallet.publicKey && (
        <nav>
          <WalletMultiButton />
          <img className="logoimg" src={bwLogo} />
        </nav>
      )}
      {wallet.publicKey && (
        <div>
          <nav>
            <WalletDisconnectButton />
            <h3>{shortenAddress(wallet.publicKey.toBase58(), 5)}</h3>
            <img className="logoimg" src={bwLogo} />
          </nav>
          <div className="container">
            <h1>Select a BitWhip to wash!</h1>
          </div>
          <NFTDisplay
            payForWash={sendTxn}
            wallet={wallet}
            processing={[highProcessing, setHighProcessing]}
            successState={[successTxn, setSuccessTxn]}
          />
        </div>
      )}
    </div>
  );
}
