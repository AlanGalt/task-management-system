import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

import { Permission, Role } from './MembersDialog.types';

interface RolesPanelProps {
  roles: Role[];
  addRole: (role: Role) => void;
  setPermissions: (roleName: string, permissions: Permission[]) => void;
}

const RolesPanel = ({ roles, addRole, setPermissions }: RolesPanelProps) => {
  const [selectedRoleName, setSelectedRoleName] = useState('');
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<Permission[]>([]);

  const rolesRef = useRef<HTMLDivElement | null>(null);
  const addRoleButtonRef = useRef<HTMLButtonElement | null>(null);
  const permissionsRef = useRef<HTMLDivElement | null>(null);

  const selectedRole = roles.find((role) => role.name === selectedRoleName);
  const currentRolePermissions = isAddingRole ? newRolePermissions : selectedRole?.permissions;

  useEffect(() => {
    if (!rolesRef.current) return;

    if (isAddingRole) {
      rolesRef.current.style.maxHeight = '100%';
      rolesRef.current.scrollTop = rolesRef.current.scrollHeight;
    }
  }, [isAddingRole]);

  const handlePanelClick = () => {
    setSelectedRoleName('');
  };

  const handlePermissionClick = (e: React.MouseEvent<HTMLDivElement>, permission: Permission) => {
    e.stopPropagation();

    if (!currentRolePermissions) return;

    const updatedPermissions = currentRolePermissions.includes(permission)
      ? currentRolePermissions.filter((p) => p !== permission)
      : [...currentRolePermissions, permission];

    selectedRole
      ? setPermissions(selectedRole.name, updatedPermissions)
      : setNewRolePermissions(updatedPermissions);
  };

  const handleRoleClick = (e: React.MouseEvent<HTMLDivElement>, role: Role) => {
    e.stopPropagation();
    setSelectedRoleName(role.name);
    if (isAddingRole) resetAddingRole();
  };

  const handleAddNewRoleClick = () => {
    setIsAddingRole(true);
    setSelectedRoleName('');
  };

  const resetAddingRole = () => {
    setIsAddingRole(false);
    setNewRoleName('');
    setNewRolePermissions([]);
  };

  const addNewRole = () => {
    if (
      !newRoleName ||
      !newRolePermissions.length ||
      roles.find((role) => role.name === newRoleName)
    ) {
      return;
    }

    addRole({ name: newRoleName, permissions: newRolePermissions });
    resetAddingRole();
  };

  return (
    <div className="flex w-full gap-3 py-6 pl-8 pr-11 h-96" onClick={handlePanelClick}>
      <div className="flex flex-col w-full">
        <div
          ref={rolesRef}
          className="flex flex-col select-none p-1 gap-2 overflow-y-auto max-h-[calc(100%-40px)]"
        >
          {roles.map((role, index) => (
            <div
              key={index}
              className={classNames(
                { 'bg-blue-500 text-white hover:bg-blue-500': role.name === selectedRoleName },
                'flex items-center bg-slate-100  hover:bg-slate-200  justify-between w-full px-2 py-1 rounded-md cursor-pointer'
              )}
              onClick={(e) => handleRoleClick(e, role)}
            >
              <span className={classNames({ 'font-medium': role.name === selectedRoleName })}>
                {role.name}
              </span>
            </div>
          ))}
          {isAddingRole && (
            <div className="flex flex-col gap-2">
              <input
                autoFocus
                className="w-full px-2 py-1 rounded-md"
                placeholder="New role name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNewRole()}
                // ref={addRoleInputRef}
              />
              <div className="flex gap-2">
                <button
                  ref={addRoleButtonRef}
                  onClick={addNewRole}
                  className="px-3 py-1 text-white bg-green-400 rounded-md w-fit hover:bg-green-500"
                >
                  Add role
                </button>
                <button
                  onClick={resetAddingRole}
                  className="p-1 h-fit text-slate-600 hover:text-slate-800"
                >
                  <XMarkIcon className="h-6 " />
                </button>
              </div>
            </div>
          )}
        </div>
        {!isAddingRole && (
          <button
            onClick={handleAddNewRoleClick}
            className="flex items-center w-[calc(100%-8px)] mx-1 gap-1 px-2 py-1 mt-1 rounded-md text-slate-500 hover:bg-slate-200"
          >
            <PlusIcon className="h-5" />
            Add new role
          </button>
        )}
      </div>
      <div
        ref={permissionsRef}
        className="flex flex-col items-start w-full h-full overflow-y-auto rounded-md"
      >
        {currentRolePermissions ? (
          Object.values(Permission).map((permission, index) => (
            <div
              onClick={(e) => handlePermissionClick(e, permission)}
              className="flex w-full gap-2 px-3 py-1 cursor-pointer select-none bg-slate-100 hover:bg-slate-200"
            >
              {/* TODO: custom checkbox */}
              <input
                type="checkbox"
                key={index}
                checked={currentRolePermissions.includes(permission)}
              />
              <span className="break-words text-start">{permission}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center w-full h-full border-2 border-dashed rounded-md border-slate-400">
            <span className="select-none text-slate-400">
              Click an existing role or create a new one to edit permissions
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesPanel;
