export interface ProjectProps {
  projectData: ProjectData;
  onRemove: () => void;
  onReturn: () => void;
}

export interface ProjectData {
  title: string;
  description?: string;
}
