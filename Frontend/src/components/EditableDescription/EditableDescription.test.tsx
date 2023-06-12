import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';

import EditableDescription from './EditableDescription';
import { EditableDescriptionProps } from './EditableDescription.types';

describe('EditableDescription', () => {
  const defaultProps: EditableDescriptionProps = {
    title: 'Test',
    description: 'This is a test description',
    hasPermission: true,
    setDescription: jest.fn(),
    onBlur: jest.fn(),
  };

  it('renders correctly', () => {
    render(<EditableDescription {...defaultProps} />);
    waitFor(() => {
      expect(screen.getByTestId('editableDescription-header')).toBeInTheDocument();
      expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    });
  });

  it('displays textarea when paragraph is clicked', () => {
    render(<EditableDescription {...defaultProps} />);
    waitFor(() => {
      fireEvent.click(screen.getByText(defaultProps.description));
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  it('updates textarea value on change', () => {
    render(<EditableDescription {...defaultProps} />);
    waitFor(() => {
      fireEvent.click(screen.getByText(defaultProps.description));

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'New test description' },
      });
      expect(defaultProps.setDescription).toHaveBeenCalledWith('New test description');
    });
  });

  it('calls onBlur when textarea loses focus', () => {
    render(<EditableDescription {...defaultProps} />);
    waitFor(() => {
      fireEvent.click(screen.getByText(defaultProps.description));

      fireEvent.blur(screen.getByRole('textbox'));

      expect(defaultProps.onBlur).toHaveBeenCalled();
    });
  });

  it('makes textarea read-only when it loses focus', () => {
    render(<EditableDescription {...defaultProps} />);
    waitFor(() => {
      fireEvent.click(screen.getByText(defaultProps.description));

      expect(screen.getByRole('textbox')).not.toBeReadOnly();

      fireEvent.blur(screen.getByRole('textbox'));

      expect(screen.getByRole('textbox')).toBeReadOnly();
    });
  });

  it('does not render Description and Bars3BottomLeftIcon when hasPermission is false and description is empty', () => {
    render(<EditableDescription {...defaultProps} hasPermission={false} description={''} />);
    waitFor(() => {
      expect(screen.getByTestId('editableDescription-header')).toBeNull();
    });
  });

  it('does not call setDescription when hasPermission is false', () => {
    render(<EditableDescription {...defaultProps} hasPermission={false} />);
    waitFor(() => {
      fireEvent.click(screen.getByText(defaultProps.description));

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'New test description' },
      });

      expect(defaultProps.setDescription).not.toHaveBeenCalled();
    });
  });
});
