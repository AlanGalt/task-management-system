export interface ProjectProps {
  projectData: ProjectData;
  onRemove: () => void;
}

export interface ProjectData {
  title: string;
  description?: string;
}
