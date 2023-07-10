import { useState } from "react";
import { getToken } from "utu-sdk-example-common/";
import { Offers } from "./offers";
import React from "react";
import { addressSignatureVerification } from "@ututrust/web-components";

import { useWeb3Modal } from '@web3modal/react'

const { open, close } = useWeb3Modal()

// A list of offers to be shown to the user, such as a list of products in an e-commerce app or a list of service
// providers in a sharing economy app. This would typically be retrieved from the app's backend.
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
  const [hasToken, setHasToken] = useState(false);

  let _window: any = window;
  let provider = _window.ethereum;

  let onClick = async () => {

    open();
    let response = await addressSignatureVerification({ walletProvider: provider });
    console.log('response', response);
  }

  return (
    <>
      <button onClick={onClick}>Connect</button>
      <Offers offers={OFFERS} />
    </>
  )
}

export default App;

