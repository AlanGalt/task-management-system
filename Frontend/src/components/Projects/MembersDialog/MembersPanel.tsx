import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Fragment, useMemo, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../../../App';
import useUserIfExists from '../../../hooks/useUserIfExists';
import ProfilePicture from '../../ProfilePicture';
import { DefaultRole, Member } from '../Project/Project.types';
import { MembersPanelProps } from './MembersDialog.types';

const MembersPanel = ({
  roles,
  members,
  setMemberRole,
  addMember,
  removeMember,
}: MembersPanelProps) => {
  const [user] = useAuthState(auth as any);
  const [newMemberRole, setNewMemberRole] = useState<string>(DefaultRole.Collaborator);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [disableAdd, setDisableAdd] = useState(false);

  const emailInputRef = useRef<HTMLInputElement | null>(null);

  // console.log(members);

  const getUser = useUserIfExists();

  const adminCount = useMemo(
    () => members.reduce((count, member) => (count += member.roleName === 'Admin' ? 1 : 0), 0),
    [members]
  );

  // TODO: display members so that current user is at the top

  // TODO: add info for user, maybe tooltip about admin count etc
  const isOnlyAdmin = (roleName: string) => adminCount === 1 && roleName === 'Admin';

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailInputRef.current?.checkValidity()) {
      setDisableAdd(true);
      return;
    }

    handleAddMember();
  };

  const handleAddMember = async () => {
    if (disableAdd) return;

    const userToAdd = await getUser({ email: newMemberEmail });

    if (!userToAdd?.uid) {
      console.error(`User with email ${newMemberEmail} doesn't exist`);
      setDisableAdd(true);
      return;
    }

    const { uid, email, name, photoURL } = userToAdd;

    if (members.some((u) => u.uid === uid)) {
      console.error(`Member with email ${newMemberEmail} already exists`);
      return;
    }

    const newMember = {
      email,
      name,
      roleName: newMemberRole,
      uid,
      photoURL,
    } as Member;

    addMember(newMember);
    setNewMemberEmail('');
  };

  const handleRemoveMember = (member: Member) => {
    if (isOnlyAdmin(member.roleName) || member.uid === user?.uid) return;

    removeMember(member.uid);
  };

  const renderListbox = (roleName: string, onChange: (newRoleName: string) => void) => {
    return (
      <Listbox value={roleName} onChange={onChange}>
        {({ open }) => (
          <div
            className={classNames(
              { 'rounded-b-none': open },
              'rounded-md relative border-slate-300 border-2 w-44 h-fit'
            )}
          >
            <Listbox.Button className="flex items-center justify-between w-full gap-2 px-2 py-1">
              <span className="truncate">{roleName}</span>
              {open ? (
                <div>
                  <ChevronUpIcon className="h-5 text-slate-500" />
                </div>
              ) : (
                <div>
                  <ChevronDownIcon className="h-5 text-slate-500" />
                </div>
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
              <Listbox.Options className="absolute z-20 -right-[1.6px] w-[calc(100%+3.2px)] bg-white border-2 border-slate-300 top-full rounded-b-md max-h-56 overflow-y-auto">
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
                    value={role.name}
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
      <form className="flex justify-between w-full gap-2" onSubmit={handleFormSubmit}>
        <input
          value={newMemberEmail}
          onChange={(e) => {
            setNewMemberEmail(e.target.value);
            setDisableAdd(false);
          }}
          onKeyDown={(e) =>
            e.key === 'Enter' && !emailInputRef.current?.checkValidity() && setDisableAdd(true)
          }
          placeholder="Email address"
          type="email"
          ref={emailInputRef}
          className="flex-1 px-2 py-1 rounded-md bg-slate-100 focus:bg-white"
        />
        {renderListbox(newMemberRole, (newRole) => setNewMemberRole(newRole))}
        <button
          type="submit"
          disabled={disableAdd}
          className={classNames(
            {
              'bg-slate-200 text-slate-400': disableAdd,
              'text-white bg-green-400 hover:bg-green-500': !disableAdd,
            },
            'px-3 py-1  rounded-md'
          )}
        >
          Add member
        </button>
      </form>

      {/* TODO: fix overflow bug when max-h is set  max-h-[17.8rem] overflow-y-auto*/}
      <div className="flex flex-col gap-2 pr-2 ">
        {members.map((member, index) => (
          <div key={index} className="flex items-center justify-between w-full">
            <div className="flex items-center justify-start gap-3">
              <ProfilePicture src={member.photoURL} className="w-10 h-10" />
              <div className="flex flex-col items-start justify-center">
                <span>
                  {member.name} {member.uid === user?.uid && '(you)'}
                </span>
                <span className="text-sm font-light text-slate-500">{member.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isOnlyAdmin(member.roleName) ? (
                <div className="relative px-2 py-1 border-2 rounded-md border-slate-300 w-44 h-fit text-start">
                  <span>{member.roleName}</span>
                </div>
              ) : (
                renderListbox(member.roleName, (newRole) => {
                  if (newRole === member.roleName) return;
                  setMemberRole(member.uid, newRole);
                })
              )}
              <button
                className={classNames(
                  {
                    'invisible pointer-events-none cursor-default':
                      isOnlyAdmin(member.roleName) || member.uid === user?.uid,
                  },
                  'h-fit'
                )}
                onClick={() => handleRemoveMember(member)}
              >
                <XMarkIcon className="h-5 text-slate-600 hover:text-slate-800" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersPanel;
