import { Timestamp } from 'firebase/firestore';
import React from 'react';

import { Permit } from '../Projects/Project/Project.types';

export interface TaskProps {
  taskData: TaskData;
  listTitle: string;
  permit: Permit;
  index: number;
  onDelete: () => void;
  onUpdate: (updatedTaskData: Partial<TaskData>) => void;
}

export interface TaskData {
  id: string;
  index: number;
  title: string;
  description?: string;
  active: boolean;
  completed: boolean;
  assignedMembersUid: string[];
  labelIds: string[];
  startDate?: Timestamp | null;
  dueDate?: Timestamp | null;
  createdAt: Timestamp;
  listId: string;
  projectId: string;
}

export interface LabelData {
  id: string;
  color: string;
  title?: string;
}

export interface TaskDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  listTitle: string;
  permit: Permit;
  assignedMembersUid: string[];
  dates: Dates;
  completed: boolean;
  labelIds: string[];
  taskLabels: LabelData[];
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  onClose: () => void;
  onUpdate: (updatedTaskData: Partial<TaskData>) => void;
  onDelete: () => void;
}

export interface AssignPopoverProps {
  customButton: React.ReactElement<HTMLButtonElement>;
  assignedMembersUid: string[];
  assignToMember: (memberId: string) => void;
}

export interface SetDatePopoverProps {
  customButton: React.ReactElement<HTMLButtonElement>;
  dates: Dates;
  setDates: (dates: Dates) => void;
}

export interface LabelPopoverProps {
  customButton: React.ReactElement<HTMLButtonElement>;
  labelIds: string[];
  toggleLabel: (labelId: string) => void;
  createLabel: (labelData: LabelData) => void;
}

export type Dates = [Date | null, Date | null];
