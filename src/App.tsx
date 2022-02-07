import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter,SolflareWalletAdapter, SolletExtensionWalletAdapter, LedgerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { useMemo, useState } from 'react';
import { LoadingContext } from './LoadingState';
import Home from './Home';
import LoadingOverlay from './LoadingOverlay';

require('./solstyles.css');

export default function App() {
    // const network = 'https://api.devnet.solana.com';
    const network = 'https://rough-green-pond.solana-mainnet.quiknode.pro/5a1a239b2dfa014a7882c9b902f94494676096cc/';
    const endpoint = useMemo(() => network, [network]);
    const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new SolletExtensionWalletAdapter(), new LedgerWalletAdapter()], [network]);

    const [loading, setLoading] = useState(false);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    <LoadingContext.Provider value={[loading, setLoading]}>
                        <Home />
                    </LoadingContext.Provider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
