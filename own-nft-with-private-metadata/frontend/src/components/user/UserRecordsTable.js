import OwnershipCertificatePopUp from "../OwnershipCertificatePopUp";
import EditRecordPopUp from "./EditRecordPopUp";
import { useState } from 'react'
import BridgeRecordPopUp from "./BridgeRecordPopUp";

/* This example requires Tailwind CSS v2.0+ */
const people = [
    { title: '3384298', owner: "Peter Pan", address: 'Apartment #1, 123 Wonderland St, 12345, WN', type: 'Apartment', size: "100.18 m2" },
    // More people...
];
  
export default function UserRecordsTable() {
  const [isOwnershipCertificateOpen, setOwnershipCertificateOpen] = useState(false);
  const [isEditRecordPopUpOpen, setEditRecordPopUpOpen] = useState(false);
  const [isBridgeRecordPopUpOpen, setBridgeRecordPopUpOpen] = useState(false);

  return (
    <div>
      <EditRecordPopUp show={isEditRecordPopUpOpen} setShow={setEditRecordPopUpOpen}></EditRecordPopUp>
      <OwnershipCertificatePopUp show={isOwnershipCertificateOpen} setShow={setOwnershipCertificateOpen}></OwnershipCertificatePopUp>
      <BridgeRecordPopUp show={isBridgeRecordPopUpOpen} setShow={setBridgeRecordPopUpOpen}></BridgeRecordPopUp>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900"> User records</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the  property records owned by the user including their ...
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
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
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                        <span className="sr-only">Ownership Certificate (NFT)</span>
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                        <span className="sr-only">Edit</span>
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                        <span className="sr-only">Bridge NFT</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {people.map((person) => (
                      <tr key={person.email}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                          {person.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.owner}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.address}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.type}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.size}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          <button onClick={ () => { console.log("clikc"); setOwnershipCertificateOpen(true); }} className="text-indigo-600 hover:text-indigo-900">
                            Ownership Certificate (NFT)<span className="sr-only">, {person.name}</span>
                          </button>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          <button onClick={ () => { console.log("clikc"); setEditRecordPopUpOpen(true); }} className="text-indigo-600 hover:text-indigo-900">
                            Edit<span className="sr-only">, {person.name}</span>
                          </button>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          <button onClick={ () => { console.log("clikc"); setBridgeRecordPopUpOpen(true); }} className="text-indigo-600 hover:text-indigo-900">
                            Bridge NFT <span className="sr-only">, {person.name}</span>
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
    )
  }
  