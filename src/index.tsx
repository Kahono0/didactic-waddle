import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { Web3Modal } from '@web3modal/react'
import reportWebVitals from './reportWebVitals';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import App from './App';
import { createRoot } from 'react-dom/client';

const chains = [arbitrum, mainnet, polygon];
// const projectId = "5da12abf6f18a40401bebb83bbbedffe" // process.env.customKey

// jd's one from https://cloud.walletconnect.com/ - created account with metamask
const projectId = "ed0689b91e26b121d6a6145437c7b857";
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
});

const ethereumClient = new EthereumClient(wagmiConfig, chains)

//const root = ReactDOM.createRoot(document.getElementById('root')!);
const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>

    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
