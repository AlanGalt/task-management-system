import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from 'firebase/firestore';

import {
  Member,
  PermissionData,
  ProjectData,
  Role,
} from '../../components/Projects/Project/Project.types';

export type RolesMap = {
  [key: string]: PermissionsMap;
};

type PermissionsMap = {
  [key: string]: string;
};

// TODO: remove all of these functions and update the actual interfaces
export const rolesArrayFromMap = (rolesMap: RolesMap) => {
  const result = [] as Role[];
  const entries = Object.entries(rolesMap);

  for (const [name, permissions] of entries) {
    const permissionArray = permissionArrayFromMap(permissions);
    result.push({
      name,
      permissions: permissionArray,
    });
  }

  return result;
};

export const permissionArrayFromMap = (permissions: PermissionsMap) => {
  const permissionEntries = Object.entries(permissions);

  const permissionArray = [] as PermissionData[];
  for (const [title, description] of permissionEntries) {
    permissionArray.push({ name: title, description });
  }

  return permissionArray;
};

export const rolesMapFromArray = (rolesArray: Role[]) => {
  return rolesArray.reduce((rolesMap, role) => {
    const permissionMap = role.permissions.reduce((map, role) => {
      map[role.name] = role.description;
      return map;
    }, {} as PermissionsMap);

    rolesMap[role.name] = permissionMap;
    return rolesMap;
  }, {} as RolesMap);
};

type MembersMap = {
  [key: string]: Omit<Member, 'uid'>;
};

export const membersMapFromArray = (membersArray: Member[]) => {
  return membersArray.reduce((membersMap, member) => {
    const { uid, ...data } = member;
    membersMap[uid] = data;
    return membersMap;
  }, {} as MembersMap);
};

const membersArrayFromMap = (membersMap: MembersMap) => {
  const result = [] as Member[];
  const entries = Object.entries(membersMap);

  for (const [uid, data] of entries) {
    result.push({
      ...data,
      uid,
    });
  }

  return result;
};

export const projectConverter: FirestoreDataConverter<ProjectData> = {
  toFirestore(project: ProjectData): DocumentData {
    const { id, roles, members, ...projectData } = project;
    const rolesMap = rolesMapFromArray(roles);
    const membersMap = membersMapFromArray(members);

    return id
      ? { id, roles: rolesMap, members: membersMap, ...projectData }
      : { roles: rolesMap, members: membersMap, ...projectData };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): ProjectData {
    const data = snapshot.data(options);
    const rolesArray = rolesArrayFromMap(data.roles);
    const membersArray = membersArrayFromMap(data.members);

    return {
      ...data,
      roles: rolesArray,
      members: membersArray,
      id: snapshot.id,
      createdAt: data.createdAt as Timestamp,
    } as ProjectData;
  },
};
