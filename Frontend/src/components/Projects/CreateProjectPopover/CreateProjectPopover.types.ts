import { ProjectData } from '../Project/Project.types';

export interface CreateProjectPopoverProps {
  onSubmit: (projectData: ProjectData) => void;
}
