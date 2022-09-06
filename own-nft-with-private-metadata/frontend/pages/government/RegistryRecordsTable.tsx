import RegisterRecordPopUp from "./RegisterRecordPopUp";
import React, {useEffect, useState} from 'react';
import OwnershipCertificatePopUp from "../../components/OwnershipCertificatePopUp";
import {createRecord} from "../../components/ContractInteraction";
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

export default function RegistryRecordsTable() {
  const [isOwnershipCertificateOpen, setOwnershipCertificateOpen] = useState(false);
  const [isRegisterRecordPopUpOpen, setRegisterRecordPopUpOpen] = useState(false);

  async function createRecordCall() {
    const cr = createRecord();
    console.log(cr);

  }

  useEffect(() => {
    createRecordCall();
  }, []);

  return (
    <div>
      <RegisterRecordPopUp show={isRegisterRecordPopUpOpen} setShow={setRegisterRecordPopUpOpen} />
      <OwnershipCertificatePopUp show={isOwnershipCertificateOpen} setShow={setOwnershipCertificateOpen} />

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
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                        <span className="sr-only">Ownership Certificate</span>
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
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
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
  );
}
