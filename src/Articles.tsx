import '@ututrust/web-components';
import { ethers } from "ethers";
import {TARGET_TYPE} from "./constants";
declare global {
  namespace JSX {
    // prevents typescript errors for the tags
    interface IntrinsicElements {
      "x-utt-balance": any;
      "x-utu-app-link": any;
      "x-utu-wallet-disconnect": any;
      "x-utu-root": any;
      "x-utu-recommendation": any;
      "x-utu-feedback-details-popup": any;
      "x-utu-feedback-form-popup": any;
    }
  }
}

let getId = (assetIdentifier: string) => {
  // The reason we are creating ether addresses is they are required for endorsements on the
  // chain.
  return ethers.utils
    .id(assetIdentifier)
    .slice(0, 40 + 2)
    .toLowerCase()
}

export default function Articles(props: any) {
  let articles = props.articles;
  let _window: any = window;
  let provider = _window.ethereum;
  let walletAddress = provider.selectedAddress;



  // @ts-ignore
  return (
    <div className="articles">
      <ul>
        {
          articles.map((article: any) =>{
            return(
          <>
          <hr />
            <div className="article" key={article.id}>
              <h1 style={{ fontWeight: 'bold' }}>{article.title}</h1>
              <p>{article.text}</p>
              <div className='feedback'>
              <x-utu-root
                source-uuid={walletAddress}
                target-type={TARGET_TYPE}
                target-uuids={getId(article.id)}
                >
                <x-utu-recommendation
                  target-uuid={getId(article.id)}
                  style={{
                   }}
                />
              </x-utu-root>
              <br />
              <x-utu-feedback-details-popup
                target-uuid={getId(article.id)}
                source-uuid={walletAddress}
              />
              <x-utu-feedback-form-popup
                source-uuid={walletAddress}
                target-uuid={getId(article.id)}
                transaction-id={5} />
                </div>
            </div>
            </>
          )
        })}
      </ul>
    </div>
  );
}
