import { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { db } from '../../App';
import { ListData } from '../../components/List/List.types';
import { listConverter } from './useProjectLists.converters';

const useProjectLists = (projectId: string) => {
  const [lists, setLists] = useState<ListData[] | undefined>(undefined);

  const listsRef = collection(db, 'lists').withConverter(listConverter);

  useEffect(() => {
    if (!projectId) return;

    const listsQuery = query(
      listsRef,
      where('active', '==', true),
      where('projectId', '==', projectId),
      orderBy('index', 'asc')
    );

    const unsubscribe = onSnapshot(
      listsQuery,
      (querySnapshot) => {
        const projectLists = querySnapshot.docs.map((doc) => doc.data()) as ListData[];
        setLists(projectLists);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [projectId]);

  const addList = useCallback(async (newList: Partial<ListData>) => {
    return addDoc(listsRef, newList).catch(console.error);
  }, []);

  const updateList = useCallback(async (listId: string, updatedData: Partial<ListData>) => {
    const listRef = doc(listsRef, listId);
    return updateDoc(listRef, updatedData).catch(console.error);
  }, []);

  const deleteList = useCallback(
    async (listId: string, projectId: string) => {
      if (!lists) return;

      const listRef = doc(listsRef, listId);
      const batch = writeBatch(db);

      const tasksRef = collection(db, 'tasks');
      const tasksQuery = query(
        tasksRef,
        where('listId', '==', listId),
        where('projectId', '==', projectId)
      );

      const tasksSnapshot = await getDocs(tasksQuery);

      tasksSnapshot.docs.forEach((task) => {
        const taskRef = doc(tasksRef, task.id);
        batch.delete(taskRef);
      });

      const deletedListIndex = lists.findIndex((list) => list.id === listId);
      const updatedLists = lists.filter((list) => list.id !== listId);

      // Adjust index values for the remaining lists after deleting the list
      updatedLists.forEach((list, index) => {
        if (list.index > deletedListIndex) {
          const updatedIndex = index;
          const listRef = doc(listsRef, list.id);

          batch.update(listRef, { index: updatedIndex });
        }
      });

      batch.delete(listRef);
      await batch.commit().catch(console.error);
    },
    [lists]
  );

  const reorderLists = useCallback(async (newOrderedLists: ListData[]) => {
    const batch = writeBatch(db);

    newOrderedLists.forEach((list, newIndex) => {
      const listRef = doc(listsRef, list.id);
      batch.update(listRef, { index: newIndex });
    });

    await batch.commit().catch(console.error);
  }, []);

  return { lists, addList, updateList, reorderLists, deleteList };
};

export default useProjectLists;
