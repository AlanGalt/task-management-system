export interface EditableDescriptionProps {
  title: string;
  description: string;
  hasPermission: boolean;
  setDescription: (description: string) => void;
  onBlur: () => void;
}
