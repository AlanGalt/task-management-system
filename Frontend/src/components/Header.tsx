import { NavLink } from 'react-router-dom';

import { Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import classNames from 'classnames';

import Logo from './Logo';
import ProfileMenu from './ProfileMenu';
import Notifications from './Notifications';

const navigation = [
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'My Tasks', to: '/my-tasks' },
  { name: 'Calendar', to: '/calendar' },
  { name: 'Analytics', to: '/analytics' },
];

const Header = () => {
  return (
    <nav className="relative flex items-center justify-between p-1 px-4 border-b-4 border-base-300 bg-base-100">
      {/* Responsive */}
      <Menu as="div" className="block md:hidden">
        {({ open }) => (
          <>
            <Menu.Button className="flex">
              {!open ? (
                <Bars3Icon className="w-10 h-10 p-2 mr-3 rounded-full hover:bg-base-300 hover:cursor-pointer" />
              ) : (
                <XMarkIcon className="w-10 h-10 p-2 mr-3 rounded-full bg-base-300 hover:cursor-pointer" />
              )}
            </Menu.Button>
            <Menu.Items
              as="div"
              className="absolute left-0 w-full text-center flex-column top-full bg-base-100"
            >
              {navigation.map((item) => (
                <Menu.Item as="div" className="w-full">
                  <NavLink
                    to={item.to}
                    key={item.name}
                    className={({ isActive }) =>
                      classNames(
                        {
                          'bg-base-content text-base-100': isActive,
                          'hover:bg-base-300': !isActive,
                        },
                        'py-2 px-4 block text-xl font-medium outline-none'
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                </Menu.Item>
              ))}
            </Menu.Items>
          </>
        )}
      </Menu>

      {/* Left side */}
      <div className="flex items-center justify-center">
        <Logo />

        {/* Navigation links */}
        <div className="hidden ml-8 md:block">
          <div>
            {navigation.map((item) => (
              <NavLink
                to={item.to}
                key={item.name}
                className={({ isActive }) =>
                  classNames(
                    {
                      'bg-base-content text-base-100': isActive,
                      'hover:bg-base-300': !isActive,
                    },
                    'py-2 mr-2 lg:mr-6 xl:mr-8 last:mr-0 px-4 rounded-lg font-medium outline-none'
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center">
        <Notifications />
        <ProfileMenu />
      </div>
    </nav>
  );
};

export default Header;
