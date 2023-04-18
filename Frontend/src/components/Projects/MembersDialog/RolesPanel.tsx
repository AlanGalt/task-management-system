import {
  CheckIcon,
  LockClosedIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

import { DefaultRole, PermissionData, Role } from '../Project/Project.types';
import { RolesPanelProps } from './MembersDialog.types';

// TODO: DELETE AND (RENAME ?) ROLES

const RolesPanel = ({
  roles,
  defaultRoles,
  addRole,
  setPermissions,
  deleteRole,
}: RolesPanelProps) => {
  const [allRoles, setAllRoles] = useState([...defaultRoles, ...roles]);

  useEffect(() => {
    setAllRoles([...defaultRoles, ...roles]);
  }, [roles]);

  const allPermissions = allRoles.find((role) => role.name === DefaultRole.Admin)?.permissions;

  const [selectedRoleName, setSelectedRoleName] = useState('');
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<PermissionData[]>([]);

  const rolesRef = useRef<HTMLDivElement | null>(null);
  const addRoleButtonRef = useRef<HTMLButtonElement | null>(null);
  const permissionsRef = useRef<HTMLDivElement | null>(null);

  const selectedRole = allRoles.find((role) => role.name === selectedRoleName);
  const currentRolePermissions = isAddingRole ? newRolePermissions : selectedRole?.permissions;

  const permissionExists = (permission: PermissionData) =>
    currentRolePermissions?.some(
      (p) => p.name === permission.name && p.description === permission.description
    );

  const isDefaultRole = (roleName: string) => defaultRoles.some((r) => r.name === roleName);

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

  const handlePermissionClick = (
    e: React.MouseEvent<HTMLDivElement>,
    permission: PermissionData
  ) => {
    e.stopPropagation();

    if (!currentRolePermissions) return;

    const updatedPermissions = permissionExists(permission)
      ? currentRolePermissions.filter(
          (p) => p.name !== permission.name || p.description !== permission.description
        )
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
      allRoles.some((role) => role.name === newRoleName)
    ) {
      return;
    }

    const newRole = { name: newRoleName, permissions: newRolePermissions } as Role;

    setAllRoles([...defaultRoles, ...roles, newRole]);
    addRole(newRole);

    resetAddingRole();
  };

  return (
    <div className="flex w-full gap-3 py-6 pl-8 pr-11 h-96" onClick={handlePanelClick}>
      <div className="flex flex-col flex-1">
        <div
          ref={rolesRef}
          className="flex flex-col select-none p-1 gap-2 overflow-y-auto max-h-[calc(100%-40px)]"
        >
          {allRoles.map((role, index) => (
            <div
              key={index}
              className={classNames(
                {
                  'bg-blue-500 text-white': role.name === selectedRoleName,
                  ' bg-slate-100  hover:bg-slate-200 ': role.name !== selectedRoleName,
                },
                'flex items-center justify-between w-full px-2 py-1 rounded-md cursor-pointer group'
              )}
              onClick={(e) => handleRoleClick(e, role)}
            >
              <span
                className={classNames(
                  { 'font-medium': role.name === selectedRoleName },
                  'break-words text-start'
                )}
              >
                {role.name}
              </span>
              {isDefaultRole(role.name) ? (
                <div>
                  <LockClosedIcon className="w-5 h-5" />
                </div>
              ) : (
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRole(role.name);
                    }}
                    className="invisible group-hover:visible"
                  >
                    <TrashIcon className="h-5" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {isAddingRole && (
            <div className="flex flex-col gap-2">
              <input
                autoFocus
                className="w-full px-2 py-1 border-2 rounded-md focus:bg-white border-slate-200"
                placeholder="New role name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNewRole()}
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
        className={classNames(
          {
            'border-dashed border-slate-400': !currentRolePermissions,
            'border-slate-200 border-r-0 border-solid': currentRolePermissions,
          },
          'flex flex-col items-start w-2/3 h-full overflow-y-auto border-2 rounded-md'
        )}
      >
        {currentRolePermissions ? (
          allPermissions?.map((permission, index) => (
            <div
              onClick={(e) => handlePermissionClick(e, permission)}
              key={index}
              className={classNames(
                {
                  'bg-blue-100 text-blue-500 hover:bg-blue-200': permissionExists(permission),
                  'bg-white hover:bg-slate-100': !permissionExists(permission),
                  'cursor-pointer': !isDefaultRole(selectedRoleName),
                },
                'flex  w-full gap-4 px-3 py-2  select-none items-center'
              )}
            >
              <div>
                <CheckIcon
                  className={classNames(
                    {
                      visible: permissionExists(permission),
                      invisible: !permissionExists(permission),
                    },
                    ' h-5 w-5'
                  )}
                />
              </div>
              <div className="flex flex-col items-start gap-1">
                <span
                  className={classNames(
                    { 'font-medium': permissionExists(permission) },
                    'break-words text-start font-medium'
                  )}
                >
                  {permission.name}
                </span>
                <span className="text-start">{permission.description}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center w-full h-full px-2 rounded-md">
            <span className="select-none text-slate-400">
              Click on existing role or create a new one to see it&apos;s permissions
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesPanel;
