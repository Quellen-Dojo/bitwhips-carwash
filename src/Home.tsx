import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet, useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback } from 'react';

export default function Home() {
    const {publicKey, sendTransaction, wallet} = useWallet();
    const anchor = useAnchorWallet();
    const { connection } = useConnection();
    console.log(anchor);

    const buttonOnClick = useCallback(async () => {
        const txn = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey('3uAvEjbkSY7GL2vddbczYwJxXWu74HHrkZeFB96u6Bi5'),
                lamports: 1 * LAMPORTS_PER_SOL,
            })
        );
        try {
            const sig = await sendTransaction(txn, connection);
            await connection.confirmTransaction(sig, 'confirmed');

        } catch (e) {
            console.log(e);
        }
    },[publicKey,sendTransaction,connection]);

    return (
    <div>
            {!anchor && (<WalletMultiButton />)}
            {anchor && (<div>
                <WalletDisconnectButton />
                <button onClick={buttonOnClick}>Send 69 Lamports</button>
                </div>)}
    </div>
    );
}

function TxnSender() {

}