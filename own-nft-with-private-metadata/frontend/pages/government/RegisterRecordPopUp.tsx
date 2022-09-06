/* This example requires Tailwind CSS v2.0+ */
import {Fragment, useRef, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import React from 'react';


interface RegisterRecordPopUpProps {
  show: boolean;
  setShow: (show: boolean) => void;
  onRegisterClick: (record: PropertyRecord) => void;
  setErrorNotification: (show: boolean) => void;
}

export interface PropertyRecord {
  token_id: string,
  metadata: {
    owner_metadata: {
      owner_id: string,
      owner_full_name: string,
      address: string,
      item_type: string,
      item_size: string;
    },
    property_metadata: {
      address: string,
      item_type: string,
      item_size: string;
    };
  },
  token_metadata: {
    title: string,
    description: string,
    copies: string;
  };
}

export default function RegisterRecordPopUp({show, setShow, onRegisterClick, setErrorNotification}: RegisterRecordPopUpProps) {
  const cancelButtonRef = useRef(null);
  const [record, setRecord] = useState<PropertyRecord>();

  function validateRecord(record) {
    if (record.token_id && record.metadata && record.metadata.owner_id &&
      record.metadata.owner_full_name &&
      record.metadata.address &&
      record.metadata.item_type &&
      record.metadata.item_size &&
      record.property_metadata &&
      record.property_metadata.address &&
      record.property_metadata.item_type &&
      record.property_metadata.item_size
    ) {
      return true;
    }
    return false;
  }

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => {setShow(false);}}>
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
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Register Record
                    </Dialog.Title>
                    <div className="mt-2 mb-4">
                      <p className="text-sm text-gray-500">
                        Enter property data
                      </p>
                    </div>
                    <div className="relative rounded-md rounded-b-none border border-gray-300 px-3 py-2">
                      <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                        Owner account id
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 sm:text-sm"
                      />
                    </div>
                    <div className="relative rounded-md rounded-b-none border border-gray-300 px-3 py-2">
                      <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                        Owner full name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 sm:text-sm"
                      />
                    </div>
                    <div className="relative rounded-md rounded-b-none rounded-t-none border border-gray-300 px-3 py-2 ">
                      <label htmlFor="job-title" className="block text-xs font-medium text-gray-900">
                        Owner Address
                      </label>
                      <input
                        type="text"
                        name="job-title"
                        id="job-title"
                        className=" w-full border-0 p-0 text-gray-900 placeholder-gray-500  sm:text-sm"
                      />
                    </div>
                    <div className="relative border border-gray-300 px-3 py-2 ">
                      <label htmlFor="job-title" className="block text-xs font-medium text-gray-900">
                        Owner Property Type
                      </label>
                      <input
                        type="text"
                        name="job-title"
                        id="job-title"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500  sm:text-sm"
                      />
                    </div>
                    <div className="relative border border-gray-300 px-3 py-2 ">
                      <label htmlFor="job-title" className="block text-xs font-medium text-gray-900">
                        Owner Property  Size
                      </label>
                      <input
                        type="text"
                        name="job-title"
                        id="job-title"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500  sm:text-sm"
                      />
                    </div>
                    <div className="relative rounded-md rounded-b-none rounded-t-none border border-gray-300 px-3 py-2 ">
                      <label htmlFor="job-title" className="block text-xs font-medium text-gray-900">
                        Property Address
                      </label>
                      <input
                        type="text"
                        name="job-title"
                        id="job-title"
                        className=" w-full border-0 p-0 text-gray-900 placeholder-gray-500  sm:text-sm"
                      />
                    </div>
                    <div className="relative border border-gray-300 px-3 py-2 ">
                      <label htmlFor="job-title" className="block text-xs font-medium text-gray-900">
                        Property Type
                      </label>
                      <input
                        type="text"
                        name="job-title"
                        id="job-title"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500  sm:text-sm"
                      />
                    </div>
                    <div className="relative border border-gray-300 px-3 py-2 ">
                      <label htmlFor="job-title" className="block text-xs font-medium text-gray-900">
                        Property  Size
                      </label>
                      <input
                        type="text"
                        name="job-title"
                        id="job-title"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500  sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-1 sm:mt-4 sm:ml-4 sm:flex sm:pl-2">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShow(false);
                      if (validateRecord(record)) {
                        onRegisterClick(record);
                      } else {
                        setErrorNotification(true)
                      }
                    }}
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {setShow(false);}}
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