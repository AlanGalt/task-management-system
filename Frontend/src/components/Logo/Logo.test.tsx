import { render, screen, waitFor } from '@testing-library/react';

import Logo from './Logo';

describe('Logo', () => {
  it('renders correctly', () => {
    render(<Logo />);
    waitFor(() => {
      expect(screen.getByAltText('Projest Master')).toBeInTheDocument();
    });
  });
});
