export interface ProjectMenuProps {
  description: string;
  onDelete: () => void;
  updateDescription: (description: string) => void;
}
