import { Timestamp } from 'firebase/firestore';

import { LabelData, TaskData } from '../../Task/Task.types';

export interface ProjectProps {
  projectData: ProjectData;
  defaultRoles: Role[];
  onDelete: () => void;
  onUpdate: (updatedProjectData: Partial<ProjectData>) => void;
  removeMember: (memberUid: string) => void;
}

export interface ProjectData {
  id: string;
  active: boolean;
  creatorId: string;
  title: string;
  description?: string;
  members: Member[];
  membersUid: string[];
  createdAt: Timestamp;
  roles: Role[];
  labels: LabelData[];
}

export interface Member {
  email: string;
  name: string;
  roleName: string;
  photoURL: string;
  uid: string;
}

export interface Role {
  name: string;
  permissions: PermissionData[];
}

export interface PermissionData {
  name: string;
  description: string;
}

export interface UserData {
  uid: string;
  email: string;
  photoURL: string;
  name: string;
}

export enum Permission {
  ManageMembers = 'Manage members',
  CreateTasks = 'Create tasks',
  EditTasks = 'Edit tasks',
  DeleteTasks = 'Delete tasks',
  CreateLists = 'Create lists',
  EditLists = 'Edit lists',
  DeleteLists = 'Delete lists',
  EditProject = 'Edit project',
  DeleteProject = 'Delete project',
}

export enum LabelColor {
  Red = 'bg-red-400',
  Pink = 'bg-pink-400',
  Orange = 'bg-orange-300',
  Yellow = 'bg-yellow-300',
  Amber = 'bg-amber-300',
  Green = 'bg-green-300',
  Lime = 'bg-lime-300',
  Blue = 'bg-blue-300',
  Indigo = 'bg-indigo-500',
  Purple = 'bg-purple-400',
}

export enum DefaultRole {
  Admin = 'Admin',
  Collaborator = 'Collaborator',
  Viewer = 'Viewer',
}

export type Permit = {
  [key in Permission]: boolean;
};

export type ListTasks = Map<string, TaskData[]>;
