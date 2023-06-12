import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import { Timestamp } from 'firebase/firestore';

import Project from './Project';
import { TaskData } from '../../Task/Task.types';
import { ListData } from '../../List/List.types';
import { DefaultRole, ProjectProps } from './Project.types';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [{ uid: '1', displayName: 'Test User', email: 'test@example.com' }],
}));

const mockProps = {
  projectData: {
    id: '0',
    active: true,
    creatorId: '123',
    title: 'Test Project',
    description: 'test description',
    members: [
      {
        email: 'test@example.com',
        name: 'test user',
        roleName: DefaultRole.Admin,
        uid: '1',
        photoURL: '',
      },
    ],
    membersUid: ['123'],
    createdAt: Timestamp.fromDate(new Date('12/05/2023')),
    roles: [],
    labels: [],
  },
  defaultRoles: [],
  onDelete: jest.fn(),
  onUpdate: jest.fn(),
  removeMember: jest.fn(),
} as ProjectProps;

const mockLists = [
  {
    id: '11',
    active: true,
    index: 0,
    createdAt: Timestamp.fromDate(new Date('12/05/2023')),
    projectId: '0',
    title: 'list1',
  },
  {
    id: '12',
    active: true,
    index: 1,
    createdAt: Timestamp.fromDate(new Date('12/05/2023')),
    projectId: '0',
    title: 'list2',
  },
] as ListData[];

const mockTasks = [
  {
    id: '21',
    index: 0,
    active: true,
    assignedMembersUid: [] as string[],
    completed: false,
    createdAt: Timestamp.fromDate(new Date('12/05/2023')),
    labelIds: [],
    title: 'task1',
    listId: '11',
    projectId: '0',
  },
  {
    id: '22',
    index: 0,
    active: true,
    assignedMembersUid: [] as string[],
    completed: false,
    createdAt: Timestamp.fromDate(new Date('12/05/2023')),
    labelIds: [],
    title: 'task2',
    listId: '12',
    projectId: '0',
  },
] as TaskData[];

jest.mock('../../../hooks/useProjectLists', () => ({
  __esModule: true,
  default: () => ({
    lists: mockLists,
    addList: jest.fn(),
    updateList: jest.fn(),
    reorderLists: jest.fn(),
    deleteList: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useProjectTasks', () => ({
  __esModule: true,
  default: () => ({
    tasks: mockTasks,
    addTask: jest.fn(),
    updateTask: jest.fn(),
    reorderTasks: jest.fn(),
    deleteTask: jest.fn(),
  }),
}));

describe('Project', () => {
  beforeEach(() => {
    render(
      <Router>
        <DragDropContext onDragEnd={jest.fn()}>
          <Project {...mockProps} />
        </DragDropContext>
      </Router>
    );
  });

  it('renders correctly', async () => {
    const projectTitle = screen.getByTestId('project-title');
    expect(projectTitle).toHaveValue(mockProps.projectData.title);

    for (const list of mockLists) {
      const listElement = await screen.findByText(list.title);
      expect(listElement).toBeInTheDocument();
    }

    for (const task of mockTasks) {
      const taskElement = await screen.findByText(task.title);
      expect(taskElement).toBeInTheDocument();
    }
  });
});
