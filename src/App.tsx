import { useState } from "react";
// import { getToken } from "utu-sdk-example-common/";
import Offers from "./Offers";
// import style from './App.module.css';

import { ethers } from "ethers";


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
    // id: "app.sushi.com"
    // id: "www.cat.com"
    id: "provider_1"
  },
  {
    name: "Jane",
    // id: "localhost:3000"
    id: "provider_2"
  },
  {
    name: "Ali",
    // id: "www.coinbase.com"
    id: "provider_3"
  }
];


function App() {
  const { open, isOpen, close } = useWeb3Modal()
  const [hasToken, setHasToken] = useState(false);

  // let overrideApiUrl = 'https://stage-api.ututrust.com/identity-api/verify-address';
  // let overrideApiUrl = process.env.apiUrl + '/identity-api/verify-address';

  let overrideApiUrl = 'https://stage-api.ututrust.com';

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

  const initEntity = async (data: AuthData) => {
    await fetch(overrideApiUrl + "/core-api-v2/entity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${data.access_token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        name: OFFERS[0].id,
        //type: "domain",
        type: "provider",
        ids: {
          //uuid: OFFERS[0].id,
          // address: OFFERS[0].id,
          uuid: ethers.utils
            .id(OFFERS[0].id)
            .slice(0, 40 + 2)
            .toLowerCase(),
          //urlz: OFFERS[0].id,
        },
        // image:
        //  "https://i0.wp.com/utu.io/wp-content/uploads/job-manager-uploads/company_logo/2020/12/cropped-UTU-LG-FV.png?fit=192%2C192&ssl=1",
      }),
    })
      .then((res) => {
        // If we sent the current utu token and we got an unauthorized error,
        // Prompt user to sign in again and then reload the page

        return res;
      })
      .catch((err) => {
        console.log("Failed to init entity on utu browser extension");
        console.log(err);
      });
  };


  let onConnectToUtuClick = async () => {
    let _window: any = window;
    let provider = _window.ethereum;
    console.log('provider: ', provider);

    // This passes the wallet provider to the SDK so it can do its magic
    // It effectively logs into the UTU Trust Network services and you get a response object back
    // which encapsulates the successful log in.  Among other things it contains the JWT Token.
    let authDataResponse = await addressSignatureVerification(
      overrideApiUrl
    );

    console.log('Ran addressSignatureVerification and got authDataResponse', authDataResponse);

    await initEntity(authDataResponse);

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

