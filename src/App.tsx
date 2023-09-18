import { useEffect, useState } from "react";
import { ethers } from "ethers";

// you Need to add the following line as the SDK does not it have its *.d.ts typing files yet:
// @ts-ignore
import { addressSignatureVerification, AuthData } from "@ututrust/web-components";

// @ts-ignore
import { useWeb3Modal } from '@web3modal/react';
import Articles from "./Articles";
import { TARGET_TYPE } from "./constants";

// A list of offers to be shown to the user, such as a list of products in an e-commerce app or a
// list of service providers in a sharing economy app. This would typically be retrieved from the
// app's backend. In this example provider_1 could be something like netflix.
const ARTICLES = [
  {
    title: "Maize farming",
    text: "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
    id: "farmin_1"
  },
  {
    title: "Beans farming",
    text: "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
    id: "farmin_2"
  },
  {
    title: "Wheat farming",
    text: "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
    id: "farmin_3"
  },
];

function Post() {
    return (
        <div className="post">
            <h2> Share something with the community</h2>
            <form>
                <input type="text" placeholder="Enter title here" />
                <textarea placeholder="Tell us something..." rows={30} />
                <button type="submit" className="post-submit">Post</button>
            </form>
        </div>
    )
}


function App() {
  const { open } = useWeb3Modal()
  const [hasToken, setHasToken] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  let overrideApiUrl = process.env.REACT_APP_API_URL;


  //check if metamasl is installed
  const isMetaMaskInstalled = () => {
    const { ethereum } = window as any;
    return Boolean(ethereum && ethereum.isMetaMask);
    };

    console.log(`MetaMask is installed: ${isMetaMaskInstalled()}`);

    //check if wallet is connected
    const connectWallet = async () => {
        const { ethereum } = window as any;
        //get address
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        //check if address is present
        if (accounts.length === 0) {
            await open();
        } else {
            setIsWalletConnected(true);
        }
    };


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

  const initEntity = async (data: AuthData, offer: any) => {
    await fetch(overrideApiUrl + "/core-api-v2/entity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${data.access_token}`,
      },
      body: JSON.stringify({
        name: offer.id,
        type: TARGET_TYPE,
        ids: {
          uuid: ethers.utils
            .id(offer.id)
            .slice(0, 40 + 2)
            .toLowerCase(),
        },
        // image:
        //  "https://i0.wp.com/utu.io/wp-content/uploads/job-manager-uploads/company_logo/2020/12/cropped-UTU-LG-FV.png?fit=192%2C192&ssl=1",
      }),
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  };


  let onConnectToUtuClick = async () => {
    // This passes the wallet provider to the SDK so it can do its magic
    // It effectively logs into the UTU Trust Network services and you get a response object back
    // which encapsulates the successful log in.  Among other things it contains the JWT Token.
    let authDataResponse = await addressSignatureVerification(
      // overrideApiUrl
    );

    // This instructs the GUI that it can show the Recommendations, show feedback and give feedback
    // screens.
    if (authDataResponse) {
      setHasToken(true);
    }

    // The initEntity call is necessary to map the offers in a remote neo4j db
    for (let i = 0; i < ARTICLES.length; i++) {
      await initEntity(authDataResponse, ARTICLES[i]);
    }

    // this passes the JWT token info to all parts of the SDK. Expect this SDK method to be
    // refactored into the SDK addressSignatureVerification in later versions of the SDK.
    triggerUtuIdentityDataSDKEvent(authDataResponse);
  }

  return (
  <>
  {!hasToken ?
    <>
    <div className="get-started-cont">
        <h1>Welcome to r/farmers</h1>
        <p> Get information on a variety of farming practices as shared by fellow farmers</p>

        { isWalletConnected ? <button type='button' className="get-started-wallet" onClick={connectWallet} disabled>Wallet Connected</button> :
        <button type='button' className="get-started-wallet" onClick={connectWallet}>Connect Wallet</button>}

        {hasToken ? <button type='button' className="get-started-utu" onClick={onConnectToUtuClick} disabled>UTU Connected</button> :
        <button type='button' className="get-started-utu" onClick={onConnectToUtuClick}>Connect to Utu</button>}
    </div>
    </>
    :
    <>
      <h2>Here is what farmers have to say</h2>
      <div className="home">
         <Articles articles={ARTICLES} />
         <Post />
        </div>
    </>
  }
      </>
  )
}

export default App;

