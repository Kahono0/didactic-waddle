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
