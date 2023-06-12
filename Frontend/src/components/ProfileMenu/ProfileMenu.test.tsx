import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';

import ProfileMenu from './ProfileMenu';

const mockUser = {
  uid: '123',
  photoURL: 'http://example.com/image.jpg',
  name: 'Test User',
  email: 'test@example.com',
};

const signOutMock = jest.fn();

jest.mock('../../App', () => ({
  auth: {
    get currentUser() {
      return mockUser;
    },
  },
}));

jest.mock('../../hooks/useUserIfExists', () => ({
  __esModule: true,
  default: () => () => mockUser,
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useSignOut: () => [signOutMock],
}));

describe('ProfileMenu', () => {
  it('renders correctly', () => {
    render(<ProfileMenu />);
    waitFor(() => {
      const profile = screen.getByAltText('Profile');
      expect(profile).toBeInTheDocument();

      act(() => {
        fireEvent.click(profile);
      });
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByTestId('signOut-button')).toBeInTheDocument();
    });
  });

  it('triggers sign out when clicked', () => {
    render(<ProfileMenu />);

    waitFor(() => {
      act(() => {
        fireEvent.click(screen.getByTestId('signOut-button'));
      });
      expect(signOutMock).toHaveBeenCalled();
    });
  });
});
