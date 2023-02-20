import React from "react";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { mainnet, localhost } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

// wagmi config for dev
const { chains: devChains, provider: devProvider } = configureChains(
  [mainnet, localhost],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string }),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: localhost.rpcUrls.default[0]
      })
    })
  ]
);

// wagmi config for prod
const { chains, provider } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string })]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains: process.env.NODE_ENV === "development" ? devChains : chains
    }),
    new WalletConnectConnector({
      chains: process.env.NODE_ENV === "development" ? devChains : chains,
      options: {
        qrcode: true,
        rpc: {
          1: `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
        }
      }
    }),
    new CoinbaseWalletConnector({
      chains: process.env.NODE_ENV === "development" ? devChains : chains,
      options: {
        appName: "carapace.finance"
      }
    })
  ],
  provider: process.env.NODE_ENV === "development" ? devProvider : provider
});

export default function WagmiWrapper({
  children
}: {
  children: React.ReactElement;
}) {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>;
}
