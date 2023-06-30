import { useState } from "react";
import { getToken } from "utu-sdk-example-common/";
import { Offers } from "./offers";

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

  const onApiKey = apiKey => getToken(apiKey, "user-1").then(token => {
    window.dispatchEvent(new CustomEvent("utuIdentityDataReady", { detail: token }));

    setHasToken(true);
  });

  return <div className="App">
    {!hasToken && <ApiKeyForm onApiKey={onApiKey} />}
    {/*{ hasToken && <Offers offers={OFFERS}/> }*/}
    {<Offers offers={OFFERS} />}
  </div>;
}

export default App;

function ApiKeyForm({ onApiKey }) {
  const [apiKey, setApiKey] = useState(null);

  return <form onSubmit={event => { event.preventDefault(); onApiKey(apiKey); }}>
    <input type="text" className="apiKey" placeholder="Your API key" onChange={event => setApiKey(event.target.value)} />
    <input type="submit" value="Submit" className="btn" />
  </form>
}

