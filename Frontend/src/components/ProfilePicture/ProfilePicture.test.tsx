import { render, screen, waitFor } from '@testing-library/react';

import ProfilePicture from './ProfilePicture';

describe('ProfilePicture', () => {
  it('renders correctly', () => {
    render(<ProfilePicture />);
    waitFor(() => {
      expect(screen.getByAltText('Profile')).toBeInTheDocument();
    });
  });
});
