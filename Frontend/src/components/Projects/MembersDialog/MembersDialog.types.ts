import { Member, PermissionData, Role } from '../Project/Project.types';

export interface MembersDialogProps {
  isOpen: boolean;
  members: Member[];
  roles: Role[];
  defaultRoles: Role[];
  setMembers: (members: Member[]) => void;
  setRoles: (roles: Role[]) => void;
  removeMember: (memberUid: string) => void;
  onClose: () => void;
}

export interface MembersPanelProps {
  members: Member[];
  roles: Role[];
  setMemberRole: (uid: string, roleName: string) => void;
  addMember: (member: Member) => void;
  removeMember: (memberUid: string) => void;
}

export interface RolesPanelProps {
  roles: Role[];
  defaultRoles: Role[];
  addRole: (role: Role) => void;
  setPermissions: (roleName: string, permissionNames: PermissionData[]) => void;
  deleteRole: (roleName: string) => void;
}
