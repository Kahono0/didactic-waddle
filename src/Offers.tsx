import '@ututrust/web-components';
import { ethers } from "ethers";

// https://www.npmjs.com/package/dotenv
// Adds variables defined in .env to process.env
// import 'dotenv/config'

declare global {
  namespace JSX {
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

export default function Offers(props: any) {

  let offers = props.offers;

  // was using process.env.apiUrl but does not work for time being
  let apiUrl = 'https://stage-api.ututrust.com';

  let _window: any = window;
  let provider = _window.ethereum;
  let walletAddress = provider.selectedAddress;

  /*
  target-uuid  

  This is the universal unique identifier of the asset we want to comment on.  It could be something 
  like the id of a product, service or a domain.  It is something which has a unique id which can be 
  commented on.                       
                                                                                
  source-uuid 

  This is the universal unique identifier of the user / entity that is making a comment.  It can be 
  something unique like a wallet address contract id.  When showing feedback it is also the unique 
  identifier of the user / entity that is wanting to see comments for a certain asset.  The reason we 
  pass this id when we want to see feedback is that we look for comments given by users / entites that
  are in that user's / entity's network.  For example a user may be connected to other people in 
  telegram, twitter and other social networks.

  api-url

  This points to the UTU environment (prod / test) where we want to give or get the feedback from.

  transaction-id

  This is a reference the user can use for any reason they see fit.  It can be for example used
  to tag a group of assets.

  target=uuids

  @todo

  target-type 

  This is the kind of asset one is commenting on.  For example if you are commenting on a certain
  web page you may wish the target-type to be a domain.  Note you can add any description here.
  */

  let getId = (assetIdentifier: string) => {

    return ethers.utils
      .id(assetIdentifier)
      .slice(0, 40 + 2)
      .toLowerCase()

    // return assetIdentifier
  }

  // @ts-ignore
  return (
    <div className="offers">
      <ul>
        {
          offers.map((offer: any) =>
            <li className="offer" key={offer.id}>
              <div style={{ fontWeight: 'bold' }}>{offer.name}</div>
              <x-utu-root
                api-url={apiUrl}
                source-uuid={walletAddress}
                target-type="provider"
                target-uuids={getId(offer.id)}>
                <x-utu-recommendation
                  target-uuid={getId(offer.id)}
                  style={{ marginTop: "-20px" }} />
              </x-utu-root>
              <br />
              <x-utu-feedback-details-popup
                api-url={apiUrl}
                target-uuid={getId(offer.id)}
                source-uuid={walletAddress}
              />
              <x-utu-feedback-form-popup
                api-url={apiUrl}
                source-uuid={walletAddress}
                target-uuid={getId(offer.id)}
                transaction-id={5} />
            </li>
          )
        }
      </ul>
    </div>
  );
}
