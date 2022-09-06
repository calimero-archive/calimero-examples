// import './App.css';
/* This example requires Tailwind CSS v2.0+ */
import {Disclosure} from '@headlessui/react';
import PlatformMenu from '../components/PlatformMenu';
import "../styles/dist/output.css";
import React, {useEffect, useState} from 'react';
import RegistryRecordsTable from './government/RegistryRecordsTable';
import UserRecordsTable from './user/UserRecordsTable';
import {getCalimeroSdk} from '../wallet/WalletUtils';


export default function App({Component, pageProps}) {
  // reportWebVitals();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (getCalimeroSdk().isSignedIn()) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }

  }, [loggedIn]);

  return (
    <div className="h-full" >
      <div className="min-h-full" >
        <Disclosure as="nav" className="border-b border-gray-200 bg-white" >
          {({open}) => (
            <PlatformMenu loggedIn={loggedIn}/>
          )}
        </Disclosure>
        < div className="py-10" >
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8" >
              <Component />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function Home() {
  console.log("home");
  // if (!CalimeroSdk.isSignedIn()) {
  //   console.log("nije");

  //   return (<button>
  //     <a href='/login' > Login with NEAR </a>
  //   </button>);
  // }


}
