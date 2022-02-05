import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter,SolflareWalletAdapter, SolletExtensionWalletAdapter, LedgerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton, WalletConnectButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useContext, useMemo, createContext, useState } from 'react';
import { LoadingContext } from './LoadingState';
import Home from './Home';

require('./solstyles.css');

export default function App() {
    // const network = 'https://api.devnet.solana.com';
    const network = 'https://rough-green-pond.solana-mainnet.quiknode.pro/5a1a239b2dfa014a7882c9b902f94494676096cc/';
    const endpoint = useMemo(() => network, [network]);
    const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new SolletExtensionWalletAdapter(), new LedgerWalletAdapter()], [network]);
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    <LoadingContext.Provider value={useState(false)}>
                        <Home />
                    </LoadingContext.Provider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
