/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface InputProps {
  title: string;
  dropdownItems:
    | {
        name: string;
        href: string;
        icon: () => JSX.Element;
      }[]
    | undefined;
}

export default function Dropdown({ dropdownItems, title }: InputProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={`group flex cursor-pointer items-center text-[#888888] text-tiny font-extralight font-inter py-2 hover:text-white transition duration-700 
                        `}
        >
          {title}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute left-2 md:-right-10 mt-2 w-32 md:w-44 rounded-md shadow-lg bg-black bg-opacity-90 ring-2 ring-[#5555FF] focus:outline-none">
          <div className="py-1 px-2 grid grid-rows-1">
            {dropdownItems &&
              dropdownItems.map((item, i) => (
                <div key={i + "dropdown"}>
                  <Menu.Item>
                    <a
                      href={item.href}
                      className="text-[#888888] text-tiny font-extralight font-inter py-2 hover:text-white transition duration-700 flex space-x-2"
                    >
                      <item.icon></item.icon>
                      <p>{item.name}</p>
                    </a>
                  </Menu.Item>
                </div>
              ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
