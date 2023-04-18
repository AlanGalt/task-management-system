import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from 'firebase/firestore';

import { TaskData } from '../../components/Task/Task.types';

export const taskConverter: FirestoreDataConverter<TaskData> = {
  toFirestore(task: TaskData): DocumentData {
    const { id, ...taskData } = task;
    return id ? { id, ...taskData } : taskData;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): TaskData {
    const data = snapshot.data(options) as TaskData;
    return {
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt as Timestamp,
      startDate: data.startDate as Timestamp,
      dueDate: data.dueDate as Timestamp,
    };
  },
};
