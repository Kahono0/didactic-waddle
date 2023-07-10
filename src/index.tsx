import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import App from './App';
import { createRoot } from 'react-dom/client';

const chains = [arbitrum, mainnet, polygon];
const projectId = "5da12abf6f18a40401bebb83bbbedffe" // process.env.customKey
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])



const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
});

//const root = ReactDOM.createRoot(document.getElementById('root')!);
const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
