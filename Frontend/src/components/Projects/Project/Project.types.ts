import { FieldValue, Timestamp } from 'firebase/firestore';

export interface ProjectProps {
  projectData: ProjectData;
  onDelete: (projectId: string) => void;
  onUpdate: (projectId: string, updatedData: Partial<ProjectData>) => void;
}

export interface ProjectData {
  id: string;
  active: boolean;
  creatorId: string;
  title: string;
  description?: string;
  members: Member[];
  membersUid: string[];
  createdAt: Timestamp | FieldValue;
}

export interface Member {
  email: string;
  name: string;
  roleId: string;
  uid: string;
}
