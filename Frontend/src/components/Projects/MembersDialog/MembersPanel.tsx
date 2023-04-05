import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Fragment, useState } from 'react';

import ProfilePicture from '../../ProfilePicture';
import { Role } from './MembersDialog.types';

interface MembersPanelProps {
  roles: Role[];
  // currentUser: ...;
}

interface Member {
  name: string;
  id: string;
  role: Role;
}

const MembersPanel = ({ roles }: MembersPanelProps) => {
  // TODO: maybe add current user to context
  const currentUser = {
    name: 'Alan Galt',
    id: 'AlanGalt#1234',
    role: roles[0],
  };

  const [members, setMembers] = useState<Member[]>([
    { ...currentUser },
    { name: 'Denis Petrov', id: 'Pepega#3456', role: roles[1] },
  ]);

  // TODO: maybe add predifined roles to context
  // just for testing
  const [newMemberRole, setNewMemberRole] = useState<Role>(roles[2]);
  // The project must have at least 1 admin
  // TODO: modify the interface so that admin can't change his role if he's the only one
  // const adminCount = useMemo(
  //   () => members.reduce((acc, curr) => (acc += curr.role === 'Admin' ? 1 : 0), 1),
  //   [members]
  // );

  // just for testing
  // TODO: remove this
  const handleRoleChange = (id: string, newRole: Role) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) => (member.id === id ? { ...member, role: newRole } : member))
    );
  };

  const renderListbox = (role: Role, onChange: (newRole: Role) => void) => {
    return (
      <Listbox value={role} onChange={onChange}>
        {({ open }) => (
          <div
            className={classNames(
              { 'rounded-b-none': open },
              'rounded-md relative border-slate-300 border-2 w-44 h-fit'
            )}
          >
            <Listbox.Button className="flex items-center justify-between w-full gap-2 px-2 py-1 truncate">
              <span>{role.name}</span>
              {open ? (
                <ChevronUpIcon className="h-5 text-slate-500" />
              ) : (
                <ChevronDownIcon className="h-5 text-slate-500" />
              )}
            </Listbox.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100 transform"
              enterFrom="opacity-0 -translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-100 transform"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-4"
            >
              <Listbox.Options className="absolute z-10 -right-[1.6px] w-[calc(100%+3.2px)] bg-white border-2 border-slate-300 top-full rounded-b-md max-h-56 overflow-y-auto">
                {roles.map((role, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        {
                          'bg-blue-100 text-blue-500': active,
                        },
                        'cursor-default select-none py-2 relative pl-9 pr-4 hover:cursor-pointer'
                      )
                    }
                    value={role}
                  >
                    {({ selected }) => (
                      <div className="flex">
                        {selected && <CheckIcon className="absolute w-5 h-5 left-2" />}
                        <span className={classNames({ 'font-medium': selected }, 'block truncate')}>
                          {role.name}
                        </span>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    );
  };

  return (
    <div className="flex flex-col w-full gap-4 py-6 pl-8 pr-11">
      <div className="flex justify-between w-full gap-2">
        <input
          placeholder="User id..."
          className="px-2 py-1 rounded-md w-36 bg-slate-100 focus:bg-white"
        />
        {renderListbox(newMemberRole, (newRole) => setNewMemberRole(newRole))}
        <button className="px-3 py-1 text-white bg-green-400 rounded-md hover:bg-green-500">
          Add user
        </button>
      </div>
      {members.map((member, index) => (
        <div key={index} className="flex items-center justify-between w-full">
          <div className="flex items-center justify-start gap-3">
            {/* TODO: replace src with actual user pictures */}
            <ProfilePicture className="w-10 h-10" />
            <div className="flex flex-col items-start justify-center">
              <span>
                {member.name} {member.id === currentUser.id && '(you)'}
              </span>
              <span className="text-sm font-light text-slate-500">{member.id}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {renderListbox(member.role, (newRole) => handleRoleChange(member.id, newRole))}
            <button onClick={() => console.log('remove member request here')}>
              <XMarkIcon className="h-5 text-slate-600 hover:text-slate-800" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembersPanel;
