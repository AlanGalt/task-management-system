import { render, screen, act, fireEvent } from '@testing-library/react';
import { Timestamp } from 'firebase/firestore';
import { MemoryRouter } from 'react-router-dom';

import { DefaultRole, ProjectData } from '../Project/Project.types';
import ProjectList from './ProjectList';

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [{ uid: '1', displayName: 'Test User', email: 'test@example.com' }],
}));

jest.mock('../../../hooks/useProjects/useProjects', () => ({
  __esModule: true,
  default: () => ({
    projects: mockProjects,
    addProject: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
    removeMember: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useDefaultRoles', () => ({
  __esModule: true,
  default: () => [],
}));

const mockProjects: ProjectData[] = [
  {
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
];

describe('ProjectList', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProjectList />
      </MemoryRouter>
    );
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText(mockProjects[0].title)).toBeInTheDocument();
  });

  it('navigates to project page on project click', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProjectList />
      </MemoryRouter>
    );
    const project = screen.getByText(mockProjects[0].title);
    act(() => {
      fireEvent.click(project);
    });
    expect(screen.getByTestId('project-container')).toBeInTheDocument();
  });
});
