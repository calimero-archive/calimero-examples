import logo from './logo.svg';
import './App.css';
/* This example requires Tailwind CSS v2.0+ */
import { Disclosure, Menu, Transition } from '@headlessui/react'
import RegistryRecordsTable from './components/government/RegistryRecordsTable';
import PlatformMenu from './components/PlatformMenu';

import {
  BrowserRouter as Router,
  Route, Routes,
} from "react-router-dom";
import UserRecordsTable from './components/user/UserRecordsTable';

function App () {
  return (
        <body class="h-full">
      <div className="min-h-full">
        <Disclosure as="nav" className="border-b border-gray-200 bg-white">
          {({ open }) => (
            <>
            <PlatformMenu></PlatformMenu>
            </>
          )}
        </Disclosure>
        <div className="py-10">
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <Router>
                <Routes>
                  <Route path="/" element={< Home />}/>
                  <Route path="/user" element={< User />}/>
                  <Route path="/marketplace" element={< Marketplace />}/>
                </Routes>
            </Router>
            </div>
          </main>
            </div>
        </div>
        </body>
  );
}

function Home() {
  return (
      <div>
      <div className="px-4 py-8 sm:px-0">
        <RegistryRecordsTable></RegistryRecordsTable>
      </div>
      </div>
)
}

function User() {
  return (
    <div> 
      <UserRecordsTable></UserRecordsTable>
    </div>
  );
} 

function Marketplace() {
  return (
    <div> 
      marketplace
    </div>
  );
} 

export default App;
