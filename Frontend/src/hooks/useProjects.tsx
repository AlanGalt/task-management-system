import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  FirestoreDataConverter,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  updateDoc,
  where,
  WithFieldValue,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, db } from '../App';
import { ProjectData } from '../components/Projects/Project/Project.types';

const projectConverter: FirestoreDataConverter<ProjectData> = {
  toFirestore(project: WithFieldValue<ProjectData>): DocumentData {
    const { id, ...projectData } = project;
    return id ? { id, ...projectData } : projectData;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): ProjectData {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      active: data.active,
      creatorId: data.creatorId,
      title: data.title,
      members: data.members,
      membersUid: data.membersUid,
      createdAt: data.createdAt as Timestamp,
    };
  },
};

// interface UseProjectsProps {
//   setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
//   setError?: React.Dispatch<React.SetStateAction<Error | undefined>>;
// }

// TODO: add archive function

const useProjects = () => {
  const [user] = useAuthState(auth as any);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const projectsCollectionRef = collection(db, 'projects');

  // get all projects that user is a part of
  // TODO: separate membership projects from the ones where user is the creator (Folders)
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      query(
        projectsCollectionRef,
        where('active', '==', true),
        where('membersUid', 'array-contains', user.uid),
        orderBy('createdAt', 'asc')
      ).withConverter(projectConverter),
      (querySnapshot) => {
        const fetchedProjects = querySnapshot.docs.map((doc) => doc.data());
        console.log(fetchedProjects);
        setProjects(fetchedProjects as ProjectData[]);
      },
      (error) => {
        console.error(error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const addProject = useCallback(
    async (newProject: Partial<ProjectData>) => {
      return addDoc(projectsCollectionRef.withConverter(projectConverter), newProject).catch(
        console.error
      );
    },
    [projectsCollectionRef, projectConverter]
  );

  const updateProject = useCallback(
    async (projectId: string, updatedData: Partial<ProjectData>) => {
      const projectRef = doc(projectsCollectionRef, projectId).withConverter(projectConverter);
      return updateDoc(projectRef, updatedData).catch(console.error);
    },
    [projectsCollectionRef, projectConverter]
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      const projectRef = doc(projectsCollectionRef, projectId).withConverter(projectConverter);
      return deleteDoc(projectRef).catch(console.error);
    },
    [projectsCollectionRef, projectConverter]
  );

  return { projects, addProject, updateProject, deleteProject };
};

export default useProjects;
