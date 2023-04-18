import { Popover } from '@headlessui/react';
import { EllipsisHorizontalIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

import { Permission, Permit } from '../Projects/Project/Project.types';

interface ListPopoverProps {
  permit: Permit;
  onDelete: () => void;
}

// TODO: add more actions
const ListPopover = ({ permit, onDelete }: ListPopoverProps) => {
  return (
    <Popover className="relative flex">
      <Popover.Button className="p-1 rounded-md hover:bg-slate-100">
        <EllipsisHorizontalIcon className="h-6" />
      </Popover.Button>
      <Popover.Panel className="absolute flex flex-col z-10 w-64 p-2 bg-white rounded-md shadow-md top-[calc(100%+4px)]">
        <div className="pb-2 border-b-[1px] border-slate-300 w-full flex items-center justify-center">
          <span>List actions</span>
          <Popover.Button className="absolute top-0 right-0 p-2 rounded-full w-fit focus:outline-none">
            <XMarkIcon className="h-5" />
          </Popover.Button>
        </div>

        <div className="mt-2">
          {permit[Permission.DeleteLists] && (
            <button
              onClick={onDelete}
              className="flex items-center w-full gap-2 p-1 rounded-md hover:bg-slate-100"
            >
              <div>
                <TrashIcon className="h-5" />
              </div>
              <span>Delete this list</span>
            </button>
          )}
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default ListPopover;
