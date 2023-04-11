import { ProjectData } from '../Project/Project.types';

export interface CreateProjectPopoverProps {
  onSubmit: (newProject: Partial<ProjectData>) => void;
}
