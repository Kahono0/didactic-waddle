import { useState } from "react";
import { getToken } from "utu-sdk-example-common/";
import { Offers } from "./offers";
import React from "react";

// you Need to add the following line as the SDK does not it have its *.d.ts typing files yet:
// @ts-ignore
import { addressSignatureVerification, triggerUtuIdentityDataSDKEvent } from "@ututrust/web-components";

import { useWeb3Modal } from '@web3modal/react'

// https://www.npmjs.com/package/dotenv
// Adds variables defined in .env to process.env
import 'dotenv/config'

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
  const { open, close } = useWeb3Modal()
  const [hasToken, setHasToken] = useState(false);

  let _window: any = window;
  let provider = _window.ethereum;



  let overrideApiUrl = 'https://stage-api.ututrust.com/identity-api/verify-address';

  let onClick = async () => {

    // This conncts your wallet
    open();

    // This passes the wallet provider to the SDK so it can do its magic
    // It effectively logs into the UTU Trust Network services and you get a response object back
    // which encapsulates the successful log in.  Among other things it contains the JWT Token.
    let authDataResponse = await addressSignatureVerification({
      overrideApiUrl: overrideApiUrl,
      walletProvider: provider
    });
    console.log('authDataResponse', authDataResponse);

    // this passes the JWT token info to the SDK. Expect this SDK method to be refactored into
    // the SDK addressSignatureVerification in later versions of the SDK.
    triggerUtuIdentityDataSDKEvent(authDataResponse);
  }

  return (
    <>
      <button onClick={onClick}>Connect</button>
      <Offers offers={OFFERS} />
    </>
  )
}

export default App;

