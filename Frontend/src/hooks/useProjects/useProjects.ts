import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, db } from '../../App';

import { ProjectData } from '../../components/Projects/Project/Project.types';
import { membersMapFromArray, projectConverter, rolesMapFromArray } from './useProjects.converters';

// TODO: add archive function

const useProjects = () => {
  const [user] = useAuthState(auth as any);
  const [projects, setProjects] = useState<ProjectData[] | undefined>(undefined);

  const projectsRef = collection(db, 'projects').withConverter(projectConverter);

  // TODO: separate membership projects from the ones where user is the creator (Folders)
  useEffect(() => {
    if (!user) return;

    const projectsQuery = query(
      projectsRef,
      where('active', '==', true),
      where('membersUid', 'array-contains', user.uid),
      orderBy('createdAt', 'asc')
    ).withConverter(projectConverter);

    const unsubscribe = onSnapshot(
      projectsQuery,
      (querySnapshot) => {
        const fetchedProjects = querySnapshot.docs.map((doc) => doc.data());
        setProjects(fetchedProjects as ProjectData[]);
      },
      (error) => {
        console.error(error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [user]);

  const addProject = useCallback(async (newProject: Partial<ProjectData>) => {
    return addDoc(projectsRef.withConverter(projectConverter), newProject).catch(console.error);
  }, []);

  const updateProject = useCallback(
    async (projectId: string, updatedData: Partial<ProjectData>) => {
      const convertedData = { ...updatedData };

      if (convertedData.roles) {
        // @ts-expect-error: temporary fix to update the document
        convertedData.roles = rolesMapFromArray(convertedData.roles);
      }

      if (convertedData.members) {
        // @ts-expect-error: temporary fix to update the document
        convertedData.members = membersMapFromArray(convertedData.members);
      }

      const projectRef = doc(projectsRef, projectId).withConverter(projectConverter);
      return updateDoc(projectRef, convertedData).catch(console.error);
    },
    []
  );

  const deleteProject = useCallback(async (projectId: string) => {
    const projectRef = doc(projectsRef, projectId).withConverter(projectConverter);

    const listsRef = collection(db, 'lists');
    const tasksRef = collection(db, 'tasks');

    const listsQuery = query(listsRef, where('projectId', '==', projectId));
    const tasksQuery = query(tasksRef, where('projectId', '==', projectId));

    const [listsSnapshot, tasksSnapshot] = await Promise.all([
      getDocs(listsQuery),
      getDocs(tasksQuery),
    ]);

    const batch = writeBatch(db);

    tasksSnapshot.docs.forEach((task) => {
      const taskRef = doc(tasksRef, task.id);
      batch.delete(taskRef);
    });

    listsSnapshot.docs.forEach((list) => {
      const listRef = doc(listsRef, list.id);
      batch.delete(listRef);
    });

    batch.delete(projectRef);

    await batch.commit().catch(console.error);
  }, []);

  const removeMember = useCallback(async (projectId: string, memberUid: string) => {
    const currentProject = doc(projectsRef, projectId).withConverter(projectConverter);
    const projectSnapshot = await getDoc(currentProject);
    const projectData = projectSnapshot.data() as ProjectData;

    // Update the members and membersUid arrays in the project document.
    const updatedMembers = projectData.members.filter((member) => member.uid !== memberUid);
    const updatedMembersUid = projectData.membersUid.filter((uid) => uid !== memberUid);

    await updateDoc(currentProject, {
      members: updatedMembers,
      membersUid: updatedMembersUid,
    });

    // Remove the member from assignedMembersUid array of each task in the project.
    const tasksRef = collection(db, 'tasks');
    const tasksQuery = query(
      tasksRef,
      where('projectId', '==', projectId),
      where('assignedMembersUid', 'array-contains', memberUid)
    );
    const tasksSnapshot = await getDocs(tasksQuery);

    const updateTasksPromises = tasksSnapshot.docs.map((task) => {
      const taskRef = doc(tasksRef, task.id);
      const taskData = task.data();
      const assignedMembersUid = taskData.assignedMembersUid as string[];
      const updatedAssignedMembersUid = assignedMembersUid.filter((uid) => uid !== memberUid);

      return updateDoc(taskRef, { assignedMembersUid: updatedAssignedMembersUid });
    });

    await Promise.all(updateTasksPromises);
  }, []);

  return { projects, addProject, updateProject, deleteProject, removeMember };
};

export default useProjects;
