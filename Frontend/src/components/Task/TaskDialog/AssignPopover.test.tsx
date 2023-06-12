import { render, screen, fireEvent, act } from '@testing-library/react';

import MembersContext from '../../../contexts/MembersContext';
import { Member } from '../../Projects/Project/Project.types';
import AssignPopover from './AssignPopover';

const membersMock = [
  {
    email: 'testuser@gmail.com',
    name: 'Test User',
    photoURL: 'http://example.com/test.jpeg',
    uid: '0',
  },
  {
    email: 'testuser2@gmail.com',
    name: 'Test User Two',
    photoURL: 'http://example.com/test2.jpeg',
    uid: '1',
  },
] as Member[];

const assignToMemberMock = jest.fn();

describe('AssignPopover', () => {
  beforeEach(() => {
    render(
      <MembersContext.Provider value={membersMock}>
        <AssignPopover
          customButton={<button>Test Button</button>}
          assignToMember={assignToMemberMock}
          assignedMembersUid={['0']}
        />
      </MembersContext.Provider>
    );
  });

  it('renders correctly', () => {
    const button = screen.getByText('Test Button');
    act(() => {
      fireEvent.click(button);
    });
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search members...')).toBeInTheDocument();
    membersMock.forEach((member) => {
      expect(screen.getByText(member.name)).toBeInTheDocument();
    });
  });

  it('filters the members list based on search input', () => {
    const button = screen.getByText('Test Button');
    act(() => {
      fireEvent.click(button);
    });
    const searchInput = screen.getByPlaceholderText('Search members...');
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'Test User Two' } });
    });

    expect(screen.getByText('Test User Two')).toBeInTheDocument();
    expect(screen.queryByText('Test User')).toBeNull();
  });

  it('calls assignToMember with the correct argument when a member is clicked', () => {
    const button = screen.getByText('Test Button');
    act(() => {
      fireEvent.click(button);
    });
    const memberElement = screen.getByText('Test User Two');
    act(() => {
      fireEvent.click(memberElement);
    });
    expect(assignToMemberMock).toHaveBeenCalledWith('1');
  });

  it('renders check icon for assigned members', () => {
    const button = screen.getByText('Test Button');
    act(() => {
      fireEvent.click(button);
    });
    expect(screen.getByTestId('assignPopover-checkIcon-0')).not.toHaveClass('invisible');
    expect(screen.getByTestId('assignPopover-checkIcon-1')).toHaveClass('invisible');
  });
});
