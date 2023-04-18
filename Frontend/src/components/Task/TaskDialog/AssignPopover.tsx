import { Popover } from '@headlessui/react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Fragment, useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../../../App';
import ProfilePicture from '../../ProfilePicture';

import MembersContext from '../../../contexts/MembersContext';
import { AssignPopoverProps } from '../Task.types';

const AssignPopover = ({
  customButton,
  assignToMember,
  assignedMembersUid,
}: AssignPopoverProps) => {
  const members = useContext(MembersContext);
  const [user] = useAuthState(auth as any);

  const [searchValue, setSearchValue] = useState('');

  const filteredMembers = members?.filter((m) =>
    m.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderHighlightedName = (name: string) => {
    if (searchValue.length === 0) {
      return name;
    }

    return name.split(new RegExp(`(${searchValue})`, 'i')).map((part, index) =>
      part.toLowerCase() === searchValue.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Popover className="relative ">
      <Popover.Button as={Fragment}>{customButton}</Popover.Button>
      <Popover.Panel className="z-10 flex flex-col absolute w-80 bg-white rounded-md top-[calc(100%+8px)] shadow-md p-2 ">
        <div className="pb-2 border-b-[1px] border-slate-300 ">
          <span>Members</span>
          <Popover.Button className="absolute top-0 right-0 p-2 rounded-full w-fit focus:outline-none">
            <XMarkIcon className="h-5" />
          </Popover.Button>
        </div>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search members..."
          autoFocus
          className="p-2 mt-2 border-[1px] rounded-md border-slate-200"
        />
        <div className="flex flex-col gap-2 px-1 mt-2 overflow-y-auto max-h-64">
          {filteredMembers?.map((member) => (
            <button
              key={member.uid}
              onClick={() => assignToMember(member.uid)}
              className="flex items-center justify-between gap-2 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <ProfilePicture src={member.photoURL} className="h-10" />
                <div className="flex gap-1">
                  <span className="truncate">{renderHighlightedName(member.name)}</span>
                  <span>{user?.uid === member.uid && '(you)'}</span>
                </div>
              </div>
              <div>
                <CheckIcon
                  className={classNames(
                    { invisible: !assignedMembersUid.includes(member.uid) },
                    'h-5'
                  )}
                />
              </div>
            </button>
          ))}
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default AssignPopover;
