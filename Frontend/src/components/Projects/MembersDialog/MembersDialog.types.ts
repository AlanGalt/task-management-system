export interface MembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Role {
  name: string;
  permissions: Permission[];
}

export enum Permission {
  Test1 = 'Read stuff',
  Test2 = 'Create stuff',
  Test3 = 'Edit stuff',
  Test4 = 'Delete stuff',
  Test5 = 'Make stuff up',
  Test7 = 'Bla bla bla',
  Test8 = 'Bla bla bla',
  Test9 = 'Bla bla bla',
  Test10 = 'Bla bla bla',
  Test11 = 'Bla bla bla',
  Test12 = 'Bla bla bla',
  Test13 = 'Bla bla bla',
  Test14 = 'Bla bla bla',
}
