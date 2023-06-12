import { render, screen, waitFor } from '@testing-library/react';

import Loader from './Loader';

describe('Loader', () => {
  it('renders correctly', () => {
    render(<Loader />);
    waitFor(() => {
      expect(screen.getByAltText('Loader')).toBeInTheDocument();
    });
  });
});
