import '@ututrust/web-components';

// https://www.npmjs.com/package/dotenv
// Adds variables defined in .env to process.env
// import 'dotenv/config'

export function Offers({ offers }) {

  // was using process.env.apiUrl but does not work for time being
  let apiUrl = 'https://stage-api.ututrust.com';

  return (
    <div className="offers">
      <h2>Welcome to the UTU SDK Demo</h2>
      <h3>Choose your provider:</h3>
      <ul>
        {
          offers.map(offer =>
            <li className="offer" key={offer.id}>
              <div>{offer.name}</div>
              <x-utu-root
                api-url={apiUrl}
                source-uuid="user-1"
                target-type="domain"
                target-uuids={offer.id}
              >
                <x-utu-recommendation
                  target-uuid={offer.id}
                  style={{ marginTop: "-20px" }} />
              </x-utu-root>
              <br /><br /><br /><br />
              <x-utu-feedback-details-popup
                api-url={apiUrl}
                target-uuid={offer.id}
                source-uuid="user-1"
              />
              <x-utu-feedback-form-popup
                api-url={apiUrl}
                source-uuid="user-1"
                target-uuid={offer.id}
                transaction-id={offer.id} />
            </li>
          )
        }
      </ul>
    </div>
  );
}
