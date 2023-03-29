import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import ProfilePicture from './ProfilePicture';

const ProfileMenu = () => {
  return (
    <Menu as="div">
      <Menu.Button className="flex items-center ml-2 hover:cursor-pointer min-w-max">
        <ProfilePicture className="h-11 w-11" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition duration-100 ease-in-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="absolute right-0 z-10 flex-col w-64 py-3 shadow-xl bg-white top-[calc(100%+4px)]">
          <div className="pb-3 border-b-2 border-base-300">
            <div className="flex justify-center">
              <ProfilePicture className="w-20 h-20" />
            </div>
            <div className="mt-3 text-center">
              <h1 className="font-bold">Mr. Pepega</h1>
              <h1>pepega@gmail.com</h1>
            </div>
          </div>

          <div>
            <Menu.Item as="div" className="flex justify-center mt-3">
              <a
                href="#"
                className="px-3 py-1 border-2 rounded-full border-base-300 hover:bg-base-200 "
              >
                Manage your account
              </a>
            </Menu.Item>
            <Menu.Item as="div" className="flex justify-center mt-2 ">
              <a
                href="#"
                className="px-3 py-1 border-2 rounded-sm border-base-300 hover:bg-base-200"
              >
                Sign out
              </a>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileMenu;
