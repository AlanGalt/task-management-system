import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';

import { db } from '../App';
import { Role } from '../components/Projects/Project/Project.types';
import { permissionArrayFromMap } from './useProjects/useProjects.converters';

const useDefaultRoles = () => {
  const defaultRolesRef = db.collection('defaultRoles');
  const defaultRolesQuery = defaultRolesRef.orderBy('createdAt', 'asc');
  const [defaultRoles] = useCollectionDataOnce(defaultRolesQuery as any);

  return defaultRoles?.map((role) => {
    return { name: role.name, permissions: permissionArrayFromMap(role.permissions) } as Role;
  });
};

export default useDefaultRoles;
