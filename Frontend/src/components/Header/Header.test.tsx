import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './Header';

describe('Loader', () => {
  it('renders correctly', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    waitFor(() => {
      expect(screen.getByText('Project Master')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
  });
});
