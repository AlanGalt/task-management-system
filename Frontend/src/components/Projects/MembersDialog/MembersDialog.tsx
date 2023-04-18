import { Dialog, Tab, Transition } from '@headlessui/react';
import { KeyIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Fragment } from 'react';

import { Member, PermissionData, Role } from '../Project/Project.types';
import { MembersDialogProps } from './MembersDialog.types';
import MembersPanel from './MembersPanel';
import RolesPanel from './RolesPanel';

const tabs = ['Members', 'Roles'];

const MembersDialog = ({
  isOpen,
  members,
  roles,
  defaultRoles,
  setMembers,
  setRoles,
  removeMember,
  onClose,
}: MembersDialogProps) => {
  const allRoles = [...defaultRoles, ...roles];

  const setPermissions = (roleName: string, permissions: PermissionData[]) => {
    const updatedRoles = roles.map((role) =>
      role.name === roleName ? { ...role, permissions: permissions } : role
    );

    setRoles(updatedRoles);
  };

  const addRole = (role: Role) => {
    setRoles([...roles, role]);
  };

  const deleteRole = (roleName: string) => {
    if (members.some((m) => m.roleName === roleName)) return;

    const updatedRoles = roles.filter((r) => r.name !== roleName);

    setRoles(updatedRoles);
  };

  const setMemberRole = (uid: string, roleName: string) => {
    const updatedMembers = members.map((member) =>
      member.uid === uid ? { ...member, roleName } : member
    );
    setMembers(updatedMembers);
  };

  const addMember = async (member: Member) => {
    console.log(member);
    const updatedMembers = [...members, member];
    setMembers(updatedMembers);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-20 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4">
                <Dialog.Panel className="relative z-20 flex w-6/12 gap-6 mx-auto bg-white rounded-md rounded-tl-none text-base-content">
                  <button
                    onClick={onClose}
                    className="absolute p-2 rounded-full top-1 right-1 w-fit hover:bg-gray-200"
                  >
                    <XMarkIcon className="h-5" />
                  </button>
                  <div className="w-full">
                    <Tab.Group>
                      <Tab.List className="absolute left-0 flex gap-1 -top-8">
                        {tabs.map((tab, index) => (
                          <Tab
                            key={index}
                            className={({ selected }) =>
                              classNames(
                                {
                                  'bg-white': selected,
                                  'bg-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-700':
                                    !selected,
                                },
                                'rounded-t-xl px-4 py-1 font-medium'
                              )
                            }
                          >
                            <div className="flex items-center gap-1">
                              {tab === 'Members' ? (
                                <UserIcon className="h-5" />
                              ) : (
                                <KeyIcon className="h-5" />
                              )}
                              <span>{tab}</span>
                            </div>
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels>
                        <Tab.Panel className="flex flex-col items-start">
                          <MembersPanel
                            members={members}
                            roles={allRoles}
                            setMemberRole={setMemberRole}
                            addMember={addMember}
                            removeMember={removeMember}
                          />
                        </Tab.Panel>
                        <Tab.Panel className="flex flex-col items-start">
                          <RolesPanel
                            roles={roles}
                            defaultRoles={defaultRoles}
                            addRole={addRole}
                            setPermissions={setPermissions}
                            deleteRole={deleteRole}
                          />
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MembersDialog;
