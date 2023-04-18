import { Timestamp } from 'firebase/firestore';

import { Permit } from '../Projects/Project/Project.types';
import { TaskData } from '../Task/Task.types';

export interface ListProps {
  listData: ListData;
  permit: Permit;
  tasks: TaskData[];
  index: number;
  isDragging: boolean;
  onDelete: () => void;
  onUpdate: (updatedListData: Partial<ListData>) => void;
  addTask: (newTask: TaskData) => void;
  updateTask: (taskId: string, updatedTaskData: Partial<TaskData>) => void;
  deleteTask: (taskId: string) => void;
}

export interface ListData {
  id: string;
  index: number;
  title: string;
  projectId: string;
  active: boolean;
  createdAt: Timestamp;
}
