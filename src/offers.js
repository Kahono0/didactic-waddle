import '@ututrust/web-components';

// https://www.npmjs.com/package/dotenv
// Adds variables defined in .env to process.env
// import 'dotenv/config'

export function Offers({ offers }) {

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

  return (
    <div className="offers">
      <ul>
        {
          offers.map(offer =>
            <x-utu-root
              api-url={apiUrl}
              source-uuid={walletAddress}
              target-type="domain"
              target-uuids={offer.id}
            >
              <li className="offer" key={offer.id}>
                <div style={{ fontWeight: 'bold' }}>{offer.name}</div>

                <x-utu-recommendation
                  target-uuid={offer.id}
                  style={{ marginTop: "-20px" }} />
                <br />
                <x-utu-feedback-details-popup
                  api-url={apiUrl}
                  target-uuid={offer.id.toLowerCase()}
                  source-uuid={walletAddress}
                />
                <x-utu-feedback-form-popup
                  api-url={apiUrl}
                  source-uuid={walletAddress}
                  target-uuid={offer.id.toLowerCase()}
                  transaction-id={offer.id} />

              </li>
            </x-utu-root>
          )
        }
      </ul>
    </div>
  );
}
