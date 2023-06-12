import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import LabelsContext from '../../../contexts/LabelsContext';
import LabelPopover from './LabelPopover';

const labelsMock = [
  {
    id: '0',
    color: 'bg-red-500',
    title: 'Urgent',
  },
  {
    id: '1',
    color: 'bg-blue-500',
    title: 'Low priority',
  },
];

const createLabelMock = jest.fn();
const toggleLabelMock = jest.fn();

describe('LabelPopover', () => {
  beforeEach(() => {
    render(
      <LabelsContext.Provider value={labelsMock}>
        <LabelPopover
          customButton={<button>Test Button</button>}
          labelIds={['0']}
          createLabel={createLabelMock}
          toggleLabel={toggleLabelMock}
        />
      </LabelsContext.Provider>
    );
  });

  it('renders correctly', () => {
    const openButton = screen.getByText('Test Button');
    act(() => {
      fireEvent.click(openButton);
    });
    expect(screen.getByText('Labels')).toBeInTheDocument();
    // expect(screen.getByPlaceholderText('Search labels...')).toBeInTheDocument();
    labelsMock.forEach((label) => {
      expect(screen.getByText(label.title)).toBeInTheDocument();
    });
  });

  // it('filters the labels list based on search input', () => {
  //   const openButton = screen.getByText('Test Button');
  //   act(() => {
  //     fireEvent.click(openButton);
  //   })
  //   const searchInput = screen.getByPlaceholderText('Search labels...');
  //   act(() => {
  //     fireEvent.change(searchInput, { target: { value: 'Low priority' } });
  //   })

  //   expect(screen.getByText('Low priority')).toBeInTheDocument();
  //   expect(screen.queryByText('Urgent')).toBeNull();
  // });

  it('triggers toggleLabel with the correct argument when a label checkbox is clicked', () => {
    const openButton = screen.getByText('Test Button');
    act(() => {
      fireEvent.click(openButton);
    });
    const labelCheckbox = screen.getByTestId('label-checkbox-1');

    if (labelCheckbox) {
      act(() => {
        fireEvent.click(labelCheckbox);
      });
      expect(toggleLabelMock).toHaveBeenCalledWith('1');
    }
  });

  // it('sets label data for editing when pencil icon is clicked', () => {
  //   const openButton = screen.getByText('Test Button');
  //   act(() => {
  //     fireEvent.click(openButton);
  //   })
  //   const pencilIcon = screen.getByText('Urgent').nextElementSibling;
  //   if (pencilIcon) fireEvent.click(pencilIcon);
  //   expect(screen.getByDisplayValue('Urgent')).toBeInTheDocument();
  // });

  // it('triggers createLabel with the correct argument when the create button is clicked', () => {
  //   const openButton = screen.getByText('Test Button');
  //   act(() => {
  //     fireEvent.click(openButton);
  //   })
  //   const createButton = screen.getByText('Create a new label');
  //   fireEvent.click(createButton);

  //   const titleInput = screen.getByPlaceholderText('Label title...');
  //   fireEvent.change(titleInput, { target: { value: 'New Label' } });

  //   const createLabelButton = screen.getByText('Create');
  //   fireEvent.click(createLabelButton);

  //   expect(createLabelMock).toHaveBeenCalled();
  //   expect(createLabelMock.mock.calls[0][0].title).toBe('New Label');
  //   expect(createLabelMock.mock.calls[0][0].color).toBeDefined();
  //   expect(createLabelMock.mock.calls[0][0].id).toBeDefined();
  // });
});
