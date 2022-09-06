/* This example requires Tailwind CSS v2.0+ */
import {Fragment, useRef} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import React from 'react';

const people = [
  {
    name: 'Calvin Hawkins',
    email: 'calvin.hawkins@example.com',
  },
  {
    name: 'Kristen Ramos',
    email: 'kristen.ramos@example.com',
  },
  {
    name: 'Ted Fox',
    email: 'ted.fox@example.com',
  },
];

export default function OwnershipCertificatePopUp(props) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={props.show} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => {props.setShow(false);}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      NFT Ownership Certificate Details
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to deactivate your account? All of your data will be permanently removed
                      </p>
                      <ul role="list" className="divide-y divide-gray-200">
                        {people.map((person) => (
                          <li key={person.email} className="flex py-4">
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{person.name}</p>
                              <p className="text-sm text-gray-700">{person.email}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:ml-10 sm:flex sm:pl-4">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => props.setShow(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}