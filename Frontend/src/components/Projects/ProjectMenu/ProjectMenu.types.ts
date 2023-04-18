import { Permit } from '../Project/Project.types';

export interface ProjectMenuProps {
  description: string;
  permit: Permit;
  onDelete: () => void;
  onLeave: () => void;
  updateDescription: (description: string) => void;
}
