import React, { useState } from 'react';
import { ethers } from "ethers";
import { create_UUID, post_article } from "./lib";
import { useEffect } from "react";
import { get_articles } from "./lib";
import { Article } from './types';

// @ts-ignore
import { addressSignatureVerification, AuthData } from "@ututrust/web-components";

// @ts-ignore
import { useWeb3Modal } from '@web3modal/react';
import Articles from "./Articles";
import { TARGET_TYPE } from "./constants";

const ARTICLES = [
  {
    title: "Maize farming",
    text: "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
    id: "farmin_1",
  },
  {
    title: "Beans farming",
    text: "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
    id: "farmin_2",
  },
  {
    title: "Wheat farming",
    text: "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
    id: "farmin_3",
  },
];

function Post(props: any) {
    return (
        <div className="post">
            <h2> Share something with the community</h2>
            <form onSubmit={props.handleSubmit}>
                <input type="text" name="title" placeholder="Enter title here" />
                <textarea name="text" placeholder="Tell us something..." rows={20} />
                <button type="submit" className="post-submit">Post</button>
            </form>
        </div>
    )
}


function App() {
  const { open } = useWeb3Modal()
  const [hasToken, setHasToken] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  let overrideApiUrl = process.env.REACT_APP_API_URL;


    useEffect(() => {
        if (window.localStorage.getItem("utuAuthData")) {
            setHasToken(true);
            get_articles().then((res) => {
                setArticles([...res, ...articles]);
            });
        }

    }, []);


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

  const initEntity = async (data: AuthData, article: any) => {
    await fetch(overrideApiUrl + "/core-api-v2/entity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${data.access_token}`,
      },
      body: JSON.stringify({
        name: article.id,
        type: TARGET_TYPE,
        ids: {
          uuid: ethers.utils
            .id(article.id)
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
        return err;
      });
  };


  let onConnectToUtuClick = async () => {
    // This passes the wallet provider to the SDK so it can do its magic
    // It effectively logs into the UTU Trust Network services and you get a response object back
    // which encapsulates the successful log in.  Among other things it contains the JWT Token.
    let authDataResponse = await addressSignatureVerification(
      // overrideApiUrl
    );

    window.localStorage.setItem("utuAuthData", JSON.stringify(authDataResponse));

    // This instructs the GUI that it can show the Recommendations, show feedback and give feedback
    // screens.
    if (authDataResponse) {
      setHasToken(true);
    }

    get_articles().then((res) => {
        setArticles([...res, ...articles]);
    });


    // this passes the JWT token info to all parts of the SDK. Expect this SDK method to be
    // refactored into the SDK addressSignatureVerification in later versions of the SDK.
    triggerUtuIdentityDataSDKEvent(authDataResponse);
  }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const title = e.target.title.value;
        const text = e.target.text.value;
        const id = create_UUID();

        const article = {
            title,
            text,
            id,
            identity: ""
        }

        await initEntity(JSON.parse(window.localStorage.getItem("utuAuthData") || ""), article);

        setArticles([article, ...articles]);

        post_article(article).then((res) => {
            if (res.status < 400) {
                console.log("success");
            } else {
                console.log("error");
            }
        });

        e.target.reset();
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
      <h2 className='heading'>Here is what farmers have to say</h2>
      <div className="home">
         <Articles articles={articles}/>
         <Post handleSubmit={handleSubmit}/>
        </div>
    </>
  }
      </>
  )
}

export default App;

