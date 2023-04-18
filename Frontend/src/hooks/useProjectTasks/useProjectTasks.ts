import { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { db } from '../../App';
import { TaskData } from '../../components/Task/Task.types';
import { taskConverter } from './useProjectTasks.converters';
import { ListTasks } from '../../components/Projects/Project/Project.types';

const useProjectTasks = (projectId: string) => {
  const [tasks, setTasks] = useState<TaskData[] | undefined>(undefined);

  const tasksRef = collection(db, 'tasks').withConverter(taskConverter);

  useEffect(() => {
    if (!projectId) return;

    const tasksQuery = query(
      tasksRef,
      where('active', '==', true),
      where('projectId', '==', projectId),
      orderBy('index', 'asc')
    );

    const unsubscribe = onSnapshot(
      tasksQuery,
      (querySnapshot) => {
        const projectTasks = querySnapshot.docs.map((doc) => doc.data()) as TaskData[];
        setTasks(projectTasks);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [projectId]);

  const addTask = useCallback(async (newTask: Partial<TaskData>) => {
    return addDoc(tasksRef, newTask).catch(console.error);
  }, []);

  const updateTask = useCallback(async (taskId: string, updatedData: Partial<TaskData>) => {
    const taskRef = doc(tasksRef, taskId);
    return updateDoc(taskRef, updatedData).catch(console.error);
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    const taskRef = doc(tasksRef, taskId);
    return deleteDoc(taskRef).catch(console.error);
  }, []);

  const reorderTasks = useCallback(
    async (listTasksMap: ListTasks, sourceListId: string, destinationListId: string) => {
      const batch = writeBatch(db);
      const sourceTasks = listTasksMap.get(sourceListId);
      const destinationTasks = listTasksMap.get(destinationListId);

      if (sourceTasks) {
        sourceTasks.forEach((task, index) => {
          const taskRef = doc(tasksRef, task.id);
          batch.update(taskRef, { listId: sourceListId, index });
        });
      }

      if (destinationTasks) {
        destinationTasks.forEach((task, index) => {
          const taskRef = doc(tasksRef, task.id);
          batch.update(taskRef, { listId: destinationListId, index });
        });
      }

      await batch.commit().catch(console.error);
    },
    []
  );

  return { tasks, addTask, updateTask, reorderTasks, deleteTask };
};

export default useProjectTasks;
