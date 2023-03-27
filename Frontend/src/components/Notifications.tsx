import { Popover, Transition } from '@headlessui/react';
import { BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import { Fragment } from 'react';

const notifications = [
  {
    content: 'Mr. Pepega commented on some project.',
    timeStamp: new Date(),
    read: false,
  },
  {
    content: "I have absolutely no idea what I'm doing.",
    timeStamp: new Date(),
    read: false,
  },
  {
    content: 'Mr. Pepega commented on some project.',
    timeStamp: new Date(),
    read: true,
  },
  {
    content: 'Mr. Pepega commented on some project.',
    timeStamp: new Date(),
    read: true,
  },
  {
    content: 'Mr. Pepega commented on some project.',
    timeStamp: new Date(),
    read: true,
  },
  {
    content: 'Mr. Pepega commented on some project.',
    timeStamp: new Date(),
    read: true,
  },
  {
    content: 'Mr. Pepega commented on some project.',
    timeStamp: new Date(),
    read: true,
  },
];

const Notifications = () => {
  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="relative p-2 rounded-full outline-none hover:bg-base-300 hover:cursor-pointer">
            {open ? <BellIconSolid className="h-7" /> : <BellIcon className="h-7" />}
            <div className="absolute w-3 h-3 border-2 rounded-full border-white bg-error top-2 right-3"></div>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition duration-100 ease-in-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute top-[calc(100%+4px)] right-0 z-10 md:shadow-xl bg-white w-96 h-96">
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-base-300">
                <h1 className="text-lg text-left">Notifications</h1>
                <a href="#">
                  <Cog6ToothIcon className="h-7 hover:cursor-pointer" />
                </a>
              </div>
              <div className="overflow-y-auto max-h-[calc(100%-(3.25rem+2px))]">
                {notifications.map((item) => (
                  <div className="relative p-3 hover:bg-base-200 hover:cursor-pointer">
                    <div className="ml-5">
                      <h1>{item.content}</h1>
                      <h1>{item.timeStamp.toLocaleString()}</h1>
                    </div>
                    {!item.read && (
                      <div className="absolute w-[0.4rem] h-[0.4rem] rounded-full bg-error left-3 top-[calc(50%_-_0.2rem)]"></div>
                    )}
                  </div>
                ))}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default Notifications;
