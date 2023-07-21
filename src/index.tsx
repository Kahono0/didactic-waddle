import React from 'react';
import './index.css';

import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import App from './App';
import { createRoot } from 'react-dom/client';

const chains = [arbitrum, mainnet, polygon];

// Change this projectId to your one - see instructions in README.md
const projectId = "ed0689b91e26b121d6a6145437c7b857";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
});

const ethereumClient = new EthereumClient(wagmiConfig, chains)
const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </React.StrictMode>
);

