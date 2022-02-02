import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection, useAnchorWallet, AnchorWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL, sendAndConfirmRawTransaction } from '@solana/web3.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './carwash.css';

type NFTMeta = {
    name: string;
    symbol: string;
    description: string;
    image: string;
    attributes: { trait_type: string; value: string }[];
    mint: string;
};

export default function Home() {
    const { publicKey, sendTransaction, wallet } = useWallet();
    const anchor = useAnchorWallet();
    const { connection } = useConnection();
    console.log(anchor);
    console.log(publicKey);

    const [highProcessing, setHighProcessing] = useState(false);

    const sendTxn = async (to: string) => {
        try {
            const txn = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: anchor.publicKey,
                    lamports: 0.001 * LAMPORTS_PER_SOL,
                    toPubkey: new PublicKey(to),
                })
            );
            const sig = await sendTransaction(txn, connection);
            console.log(`Signature: ${sig}`);
            return sig;
        } catch {
            console.log('Rejected or TXN failed');
        }
    };

    return (
        <div>
            {!anchor && (
                <nav>
                    <WalletMultiButton />
                </nav>
            )}
            {anchor && (
                <div>
                    <nav>
                        <WalletDisconnectButton />
                    </nav>
                    <div className='container'>
                        <h1>Select a BitWhip to wash!</h1>
                    </div>
                    <NFTDisplay
                        payForWash={() => sendTxn('3uAvEjbkSY7GL2vddbczYwJxXWu74HHrkZeFB96u6Bi5')}
                        wallet={anchor}
                        processing={[highProcessing, setHighProcessing]}
                    />
                </div>
            )}
        </div>
    );
}

function NFTDisplay(props: {
    wallet: AnchorWallet;
    payForWash: Function;
    processing: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
    

    const filterNonCleaned = (metadataArray: Array<NFTMeta>) => {
        const cleanedInAttributes = (attrs: { trait_type: string; value: string }[]) => {
            for (const attr of attrs) {
                if (attr.trait_type === 'Washed') {
                    return true;
                }
            }
            return false;
        };

        return metadataArray.filter(v => !cleanedInAttributes(v.attributes));
    };

    const filterLandevos = (metadataArray: Array<NFTMeta>) => {
        return metadataArray.filter(v => v.description === 'BitWhips Series 1 - Landevo');
    };

    const [nftData, setNFTData] = useState<Array<NFTMeta>>(undefined);

    

    useEffect(() => {
        const fetchMetadata = async () => {
            const metadata = await(
                await fetch(
                    `http://localhost:3002/getallwhips?wallet=${props.wallet.publicKey.toBase58()}&includeTopLevel=true`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
                )
            ).json();
            setNFTData(metadata);
        };
        fetchMetadata();
    }, []);

    return (
        <div className='container'>
            {nftData && (
                <div className='nftContainer'>
                        {filterNonCleaned(filterLandevos(nftData)).map((v, k) => <NFTImage payForWash={props.payForWash} wallet={props.wallet} nftMetadata={v} key={k} />)}
                </div>
            )}
            {!nftData && (
                <div className='nftContainer'>
                    <h1 style={{color: 'white'}}>Loading...</h1>
                </div>
            )}
        </div>
    );
}

function NFTImage(props: { nftMetadata: NFTMeta, payForWash: Function, wallet: AnchorWallet }) {
    const submitNFTToWash = useCallback(
        async () => {
            const sig = await props.payForWash();
            if (sig) {
                const processRes = await fetch('http://localhost:3002/processcarwash', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ signature: sig, nft: props.nftMetadata, fromWallet: props.wallet.publicKey.toBase58() }),
                });
                if (processRes.status == 200) {
                    window.location.reload();
                } else {
                    console.log('Did not return 200?');
                }
            }
        },
        []
    );
    return (<img className='nftImage' src={props.nftMetadata.image} onClick={submitNFTToWash} />);
}