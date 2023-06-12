import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Timestamp } from 'firebase/firestore';

import Task from './Task';
import LabelsContext from '../../contexts/LabelsContext';
import MembersContext from '../../contexts/MembersContext';
import { Member } from '../Projects/Project/Project.types';
import { LabelData, TaskData } from './Task.types';

jest.mock('react-beautiful-dnd', () => ({
  Draggable: ({ children }: { children: any }) =>
    children({ draggableProps: {}, dragHandleProps: {}, innerRef: null }, {}),
}));

const taskDataMock = {
  id: '1',
  title: 'Test Task',
  description: 'Task Description',
  assignedMembersUid: ['0'],
  startDate: Timestamp.fromDate(new Date('05/06/2023')),
  dueDate: Timestamp.fromDate(new Date('07/06/2023')),
  completed: false,
  labelIds: ['0'],
  index: 0,
  active: true,
  createdAt: Timestamp.fromDate(new Date('12/05/2023')),
  listId: '0',
  projectId: '0',
} as TaskData;

const membersMock = [
  {
    email: 'testuser@gmail.com',
    name: 'test user',
    roleName: 'Admin',
    photoURL: 'http://example.com/test.jpeg',
    uid: '0',
  },
] as Member[];

const labelsMock = [
  {
    id: '0',
    color: 'red',
    title: 'test label',
  },
] as LabelData[];

const listTitleMock = 'To Do';

const permitMock = {
  'Manage members': true,
  'Create tasks': true,
  'Edit tasks': true,
  'Delete tasks': true,
  'Create lists': true,
  'Edit lists': true,
  'Delete lists': true,
  'Edit project': true,
  'Delete project': true,
};

const indexMock = 0;
const onDeleteMock = jest.fn();
const onUpdateMock = jest.fn();

describe('Task', () => {
  beforeEach(() => {
    render(
      <MembersContext.Provider value={membersMock}>
        <LabelsContext.Provider value={labelsMock}>
          <Task
            taskData={taskDataMock}
            listTitle={listTitleMock}
            permit={permitMock}
            index={indexMock}
            onDelete={onDeleteMock}
            onUpdate={onUpdateMock}
          />
        </LabelsContext.Provider>
      </MembersContext.Provider>
    );
  });

  it('renders correctly', () => {
    expect(screen.getByText(taskDataMock.title)).toBeInTheDocument();
    expect(screen.getByTestId('task-members')).toBeInTheDocument();
    expect(screen.getByTestId('task-labels')).toBeInTheDocument();
    expect(screen.getByTestId('task-dates')).toBeInTheDocument();
  });

  it('allows to edit task on pencil click', () => {
    const editButton = screen.getByTestId('task-editButton');
    act(() => {
      fireEvent.click(editButton);
    });
    expect(screen.getByTestId('task-input')).toBeInTheDocument();
    expect(screen.getByTestId('task-saveButton')).toBeInTheDocument();
  });

  it('correctly updates task', () => {
    const editButton = screen.getByTestId('task-editButton');
    act(() => {
      fireEvent.click(editButton);
    });

    const input = screen.getByTestId('task-input');
    const saveButton = screen.getByTestId('task-saveButton');

    act(() => {
      fireEvent.change(input, { target: { value: 'New Task Title' } });
      fireEvent.click(saveButton);
    });

    expect(onUpdateMock).toHaveBeenCalledWith({ title: 'New Task Title' });
  });

  it('correctly reverts changes on blur', () => {
    const editButton = screen.getByTestId('task-editButton');
    act(() => {
      fireEvent.click(editButton);
    });

    const input = screen.getByTestId('task-input');

    fireEvent.change(input, { target: { value: 'New Task Title' } });
    fireEvent.blur(input);

    waitFor(() => {
      expect(onUpdateMock).not.toHaveBeenCalled();
      expect(input).toHaveValue(taskDataMock.title);
    });
  });
});
