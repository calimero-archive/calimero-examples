import RegisterRecordPopUp from "./RegisterRecordPopUp";
import React, {useEffect, useState} from 'react';
import OwnershipCertificatePopUp from "../../components/OwnershipCertificatePopUp";
import Notification from "../../components/Notification";
import {nftInitContract, NftInitDefault, NftMint, nftMint} from "../../near/NFTContractInteraction";
import {RegistrarCreateRecord, RegistrarChangeOwner, registrarCreateRecord, registratInitContract, registrarChangeOwner} from "../../near/RegistrarContractInteraction";

const people = [
  {
    title: '3384298',
    owner: "Peter Pan",
    address: 'Apartment #1, 123 Wonderland St, 12345, WN',
    type: 'Apartment',
    size: "100.18 m2"
  },
  // More people...
];

const mockCreateRecord: RegistrarCreateRecord = {
  token_id: "matej8",
  metadata: {
    owner_metadata: {
      owner_id: "matej.hackathon.calimero.testnet",
      owner_full_name: "matej vuki",
      address: "adresa usera",
      item_type: "Stan",
      item_size: "100"
    },
    property_metadata: {
      address: "adresa propertya",
      item_type: "Kuca",
      item_size: "100"
    }
  }, token_metadata: {
    title: "Bazen uz plazu",
    description: "Plavo more",
    copies: 1
  }
};

const mockChangeOwner: RegistrarChangeOwner = {
  token_id: "matej8",
  metadata: {
    owner_metadata: {
      owner_id: "matej.hackathon.calimero.testnet",
      owner_full_name: "matej vuki",
      address: "adresa usera",
      item_type: "Stan",
      item_size: "100"
    },
    property_metadata: {
      address: "adresa propertya",
      item_type: "Kuca",
      item_size: "100"
    }
  },
  token_metadata: {
    title: "Bazen uz plazu",
    description: "Plavo more",
    copies: 1
  }
};

const mockNftInit: NftInitDefault = {
  owner_id: "matej2.hackathon.calimero.testnet",
  property_metadata: {
    address: "adresa propertya",
    item_type: "Kuca",
    item_size: "100"
  }
};

const mockNftMint: NftMint = {
  token_id: "matej11",
  owner_id: "matej2.hackathon.calimero.testnet",
  token_metadata: {
    title: "Bazen uz plazu",
    description: "Plavo more",
    copies: 1
  }
};

export default function RegistryRecordsTable() {
  const [isOwnershipCertificateOpen, setOwnershipCertificateOpen] = useState(false);
  const [isRegisterRecordPopUpOpen, setRegisterRecordPopUpOpen] = useState(false);
  const [errorNotification, setErrorNotification] = useState(false);


  async function registrarCreateRecordCall(record: RegistrarCreateRecord) {
    const receipt = registrarCreateRecord(record);
    console.log(receipt);
  }

  async function initRegistrarContractCall() {
    const receipt = registratInitContract();
    console.log(receipt);
  }

  async function registrarChangeOwnerCall(record: RegistrarChangeOwner) {
    const receipt = registrarChangeOwner(record);
    console.log(receipt);
  }

  async function initNftContractCall(record: NftInitDefault) {
    const receipt = nftInitContract(record);
    console.log(receipt);
  }

  async function nftMintCall(record: NftMint) {
    const receipt = nftMint(record);
    console.log(receipt);
  }

  useEffect(() => {
    // registrarChangeOwnerCall(mockChangeOwner);
    // initRegistrarContractCall()
    // initNftContractCall(mockNftInit)
    // nftMintCall(mockNftMint);
  }, []);

  return (
    <>
      <div>
        <RegisterRecordPopUp
          show={isRegisterRecordPopUpOpen}
          setShow={setRegisterRecordPopUpOpen}
          onRegisterClick={registrarCreateRecordCall}
          setErrorNotification={setErrorNotification} />

        <OwnershipCertificatePopUp
          show={isOwnershipCertificateOpen}
          setShow={setOwnershipCertificateOpen} />

        {/* <Notification
          title="Record error"
          description="All data are mandatory"
          show={errorNotification}
          sticky={false}
          setShow={setErrorNotification}
        /> */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900"> Registered records</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the registered property records including their ...
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                onClick={() => {setRegisterRecordPopUpOpen(true);}}
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 sm:w-auto"
              >
                Register Record
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                        >
                          Record Id
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Owner
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Address
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Type
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Size
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Ownership Certificate
                        </th>

                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {people.map((person, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                            {person.title}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.owner}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.address}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.type}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.size}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium sm:pr-6 lg:pr-8">
                            <button onClick={() => {setOwnershipCertificateOpen(true);}} className="text-indigo-600 hover:text-indigo-900">
                              Ownership Certificate (NFT)
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
