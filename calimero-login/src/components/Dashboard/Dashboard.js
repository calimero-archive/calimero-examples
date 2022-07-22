import React from 'react';

import { CalimeroAuth } from 'calimero-auth-sdk';

export default function Dashboard() {
  if (CalimeroAuth.isSignedIn()) {
    return <button onClick={CalimeroAuth.signOut}>
      Logout
    </button>
  }
  
  return(
  <button>
    <a href='/login'>Login with NEAR</a>
  </button>
);
}
