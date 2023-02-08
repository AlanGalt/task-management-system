export interface DialogProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
}
