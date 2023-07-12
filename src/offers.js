import '@ututrust/web-components';

// https://www.npmjs.com/package/dotenv
// Adds variables defined in .env to process.env
import 'dotenv/config'

export function Offers({ offers }) {
  return (
    <div className="offers">
      <h2>Welcome to the UTU SDK Demo</h2>
      <h3>Choose your provider:</h3>
      <x-utu-root source-uuid="user-1" target-type="provider">
        <ul>
          {
            offers.map(offer =>
              <li className="offer" key={offer.id}>
                <div>{offer.name}</div>
                <x-utu-recommendation
                  api-url={process.env.apiUrl}
                  target-uuid={offer.id}
                  style={{ marginTop: "-20px" }} />
                <br /><br /><br /><br />
                <x-utu-feedback-details-popup
                  api-url={process.env.apiUrl}
                  target-uuid={offer.id}
                />
                <x-utu-feedback-form-popup
                  api-url={process.env.apiUrl}
                  source-uuid="user-1"
                  target-uuid={offer.id}
                  transaction-id={offer.id} />
              </li>
            )
          }
        </ul>
      </x-utu-root>
    </div>
  );
}
