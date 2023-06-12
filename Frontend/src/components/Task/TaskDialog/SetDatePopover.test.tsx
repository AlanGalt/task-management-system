import { render, fireEvent, act, screen } from '@testing-library/react';

import { Dates } from '../Task.types';
import SetDatePopover from './SetDatePopover';

describe('SetDatePopover', () => {
  let setDates: (dates: Dates) => void;

  beforeEach(() => {
    setDates = jest.fn();
    render(
      <SetDatePopover
        customButton={<button>Test button</button>}
        dates={[new Date('12/05/2023'), new Date('12/05/2023')]}
        setDates={setDates}
      />
    );
  });

  it('should render correctly', () => {
    const openButton = screen.getByText('Test button');
    expect(openButton).toBeInTheDocument();
  });

  // it('should handle start date interactions correctly', async () => {
  //   // Opening the popover
  //   fireEvent.click(screen.getByText('Custom Button'));

  //   // Checking start date checkbox
  //   const checkboxes = getAllByRole('checkbox');
  //   await act(async () => {
  //     fireEvent.click(checkboxes[0]);
  //   });

  //   // Setting a start date
  //   fireEvent.click(getByText('DatePicker'));

  //   // Saving the dates
  //   fireEvent.click(getByText('Save'));

  //   expect(setDates).toHaveBeenCalled();
  // });

  // it('should handle due date interactions correctly', async () => {
  //   // Opening the popover
  //   fireEvent.click(getByText('Custom Button'));

  //   // Checking due date checkbox
  //   const checkboxes = getAllByRole('checkbox');
  //   await act(async () => {
  //     fireEvent.click(checkboxes[1]);
  //   });

  //   // Setting a due date
  //   fireEvent.click(getByText('DatePicker'));

  //   // Saving the dates
  //   fireEvent.click(getByText('Save'));

  //   expect(setDates).toHaveBeenCalled();
  // });

  // it('should handle removing the dates correctly', () => {
  //   // Opening the popover
  //   fireEvent.click(getByText('Custom Button'));

  //   // Removing the dates
  //   fireEvent.click(getByText('Remove'));

  //   expect(setDates).toHaveBeenCalledWith([null, null]);
  // });
});
