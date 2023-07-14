import { useState } from "react";
// import { getToken } from "utu-sdk-example-common/";
import { Offers } from "./offers";
// import style from './App.module.css';


// you Need to add the following line as the SDK does not it have its *.d.ts typing files yet:
// @ts-ignore
import { addressSignatureVerification, AuthData } from "@ututrust/web-components";

// @ts-ignore
import { useWeb3Modal } from '@web3modal/react';

// https://www.npmjs.com/package/dotenv
// Adds variables defined in .env to process.env
// import 'dotenv/config'

// A list of offers to be shown to the user, such as a list of products in an e-commerce app or a 
// list of service providers in a sharing economy app. This would typically be retrieved from the 
// app's backend.
const OFFERS = [
  {
    name: "Paul",
    id: "provider-1"
  },
  {
    name: "Jane",
    id: "provider-2"
  },
  {
    name: "Ali",
    id: "provider-3"
  }
];


function App() {
  const { open, isOpen, close } = useWeb3Modal()
  const [hasToken, setHasToken] = useState(false);

  let overrideApiUrl = 'https://stage-api.ututrust.com/identity-api/verify-address';
  // let overrideApiUrl = process.env.apiUrl + '/identity-api/verify-address';

  const triggerUtuIdentityDataSDKEvent = (
    identityData: AuthData
  ): void => {
    const event = new CustomEvent("utuIdentityDataReady", {
      detail: identityData,
    });
    window.dispatchEvent(event);
  };


  let onConnectToWalletClick = async () => {
    // This connects your wallet
    await open();
  }


  let onConnectToUtuClick = async () => {
    let _window: any = window;
    let provider = _window.ethereum;
    console.log('provider: ', provider);

    // This passes the wallet provider to the SDK so it can do its magic
    // It effectively logs into the UTU Trust Network services and you get a response object back
    // which encapsulates the successful log in.  Among other things it contains the JWT Token.
    let authDataResponse = await addressSignatureVerification({
      overrideApiUrl: overrideApiUrl,
      walletProvider: provider
    });

    console.log('Ran addressSignatureVerification and got authDataResponse', authDataResponse);

    // this passes the JWT token info to the SDK. Expect this SDK method to be refactored into
    // the SDK addressSignatureVerification in later versions of the SDK.
    triggerUtuIdentityDataSDKEvent(authDataResponse);

    console.log('triggered event to send the authDataResponse');
  }

  return (
    <div style={{ backgroundColor: 'antiquewhite', padding: '20px', border: '1px solid black' }}>
      <h2>Welcome to the UTU SDK Demo for React</h2>
      <div>
        (1) <button type='button' style={{ cursor: 'pointer' }}
          className={`x-utu-btn x-utu-btn-light border-radius`}
          onClick={onConnectToWalletClick} >Connect to Wallet</button>
      </div>
      <div style={{ paddingTop: '10px' }}>
        (2) <button type='button' style={{ cursor: 'pointer' }}
          className={`x-utu-btn x-utu-btn-light border-radius`}
          onClick={onConnectToUtuClick}>Connect to UTU</button>
      </div>
      <div style={{ paddingTop: '10px' }}>
        (3) Give or Show Feedback
      </div>
      <Offers offers={OFFERS} />
    </div >
  )
}

export default App;

