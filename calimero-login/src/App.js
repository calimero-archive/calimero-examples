import './App.css';

import { CalimeroTokenData, CalimeroAuth } from 'calimero-auth-sdk';


function App() {
  const calimeroAuth = new CalimeroAuth()
  
  if (!calimeroAuth.isSignedIn()) {
    calimeroAuth.signIn({
      shardId: "testing.calimero",
      walletUrl: "https://testnet.mynearwallet.com/verify-owner",
      authServiceUrl: "http://localhost:1336"
    });

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={CalimeroAuth.signOut()}>Login with NEAR</button>
      </header>
    </div>
  );
    
  }
}

export default App;
