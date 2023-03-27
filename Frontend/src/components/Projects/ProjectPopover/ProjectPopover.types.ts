import { ProjectData } from '../Project/Project.types';

export interface ProjectPopoverProps {
  onSubmit: (projectData: ProjectData) => void;
}
