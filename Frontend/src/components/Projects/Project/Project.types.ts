export interface ProjectProps {
  projectData: ProjectData;
  onDelete: () => void;
}

export interface ProjectData {
  title: string;
  description?: string;
}
