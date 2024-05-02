import React from 'react'
import { sepolia, useAccount } from 'wagmi'
import { useConnectModal, connectorsForWallets, darkTheme, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { goerli, polygon, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { braveWallet, coinbaseWallet, metaMaskWallet, okxWallet, trustWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import '@rainbow-me/rainbowkit/styles.css';


const { chains, publicClient } = configureChains(
    [polygon, polygonMumbai,sepolia,goerli],
    [
        alchemyProvider({ apiKey: "5JOLBM2ur8GdBO2a9lftNFppgUb6rRPa" }),
        publicProvider()
    ]
);

const connectors = connectorsForWallets([
    {
        groupName: "Popular",
        wallets: [
            metaMaskWallet({ projectId: "abc", chains }),
            coinbaseWallet({projectId: "abcd", chains })
        ],
    },
]);
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
})

const WagmiUtils = ({compo}) => {

    const { openConnectModal } = useConnectModal();

    return (
        <>
            <WagmiConfig config={wagmiConfig}>
                <RainbowKitProvider
                    modalSize="compact"
                    theme={darkTheme({
                        accentColor: "#394bf2",
                        accentColorForeground: "white",
                        borderRadius: "medium",
                        fontStack: "rounded",
                        overlayBlur: "small",
                    })}
                    chains={chains}
                >
                   {/* {compo} */}
                   <ConnectButton/>
                </RainbowKitProvider>
            </WagmiConfig>
               
        </>
    )
}

export default WagmiUtils