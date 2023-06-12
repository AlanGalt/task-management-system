import { render, fireEvent, screen, act } from '@testing-library/react';

import FloatingLabelInput from './FloatingLabelInput';

describe('FloatingLabelInput', () => {
  const defaultProps = {
    label: 'Test Label',
    value: '',
    onChange: jest.fn(),
  };

  it('renders correctly', () => {
    render(<FloatingLabelInput {...defaultProps} type="password" />);
    expect(screen.getByTestId('floatingLabelInput-input')).toBeInTheDocument();
    expect(screen.getByTestId('floatingLabelInput-button')).toBeInTheDocument();
    expect(screen.getByTestId('floatingLabelInput-label')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('changes value correctly', () => {
    render(<FloatingLabelInput {...defaultProps} />);
    const input = screen.getByTestId('floatingLabelInput-input');
    act(() => {
      fireEvent.change(input, { target: { value: 'test' } });
    });
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('toggles password visibility correctly', () => {
    render(<FloatingLabelInput {...defaultProps} type="password" />);

    const input = screen.getByTestId('floatingLabelInput-input');
    expect(input).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByTestId('floatingLabelInput-button');
    act(() => {
      fireEvent.click(toggleButton);
    });
    expect(input).toHaveAttribute('type', 'text');

    act(() => {
      fireEvent.click(toggleButton);
    });
    expect(input).toHaveAttribute('type', 'password');
  });
});
