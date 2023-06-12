import { Popover } from '@headlessui/react';
import { ArrowLeftIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Checkbox } from '@mantine/core';
import { Fragment, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import LabelsContext from '../../../contexts/LabelsContext';
import { LabelColor } from '../../Projects/Project/Project.types';
import { LabelPopoverProps, LabelData } from '../Task.types';

const LabelPopover = ({ customButton, labelIds, createLabel, toggleLabel }: LabelPopoverProps) => {
  const labels = useContext(LabelsContext);
  const [searchValue, setSearchValue] = useState('');
  const filteredLabels = labels?.filter((label) =>
    label.title?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const [newLabelText, setNewLabelText] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('bg-slate-300');
  const [currentLabelId, setCurrentLabelid] = useState('');

  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);

  const swatches = Object.values(LabelColor).map((color, idx) => (
    <div
      key={idx}
      onClick={() => setNewLabelColor(color)}
      className={`w-16 h-10 cursor-pointer rounded-md ${color} ${
        newLabelColor === color && 'ring-2 ring-offset-2 ring-blue-600'
      }`}
    ></div>
  ));

  const handleCreate = () => {
    const newLabel = {
      id: uuidv4(),
      color: newLabelColor,
      title: newLabelText,
    };

    createLabel(newLabel);
  };

  const handleUpdate = () => {
    const updatedLabel = {
      color: newLabelColor,
      title: newLabelText,
    };
  };

  const handlePencilClick = (label: LabelData) => {
    setNewLabelColor(label.color);
    setNewLabelText(label.title ?? '');
    setCurrentLabelid(label.id);
    setIsEditingLabel(true);
  };

  const goBack = () => {
    setIsCreatingLabel(false);
    setIsEditingLabel(false);
  };

  return (
    <Popover>
      <Popover.Button as={Fragment}>{customButton}</Popover.Button>
      <Popover.Panel className="absolute right-0 z-10 flex flex-col items-center p-2 bg-white rounded-md shadow-md -top-24 w-72">
        <div className="pb-2 border-b-[1px] border-slate-300 w-full">
          {(isCreatingLabel || isEditingLabel) && (
            <button onClick={goBack} className="absolute left-0 p-2 rounded-full top-1 w-fit ">
              <ArrowLeftIcon className="h-5" />
            </button>
          )}
          <span>Labels</span>
          <Popover.Button className="absolute top-0 right-0 p-2 rounded-full w-fit">
            <XMarkIcon className="h-5" />
          </Popover.Button>
        </div>
        {isCreatingLabel || isEditingLabel ? (
          <div className="flex flex-col items-start w-full gap-4 mt-2">
            <div className={`rounded-md w-full h-14 flex px-2  items-center ${newLabelColor}`}>
              <span className="w-full text-xl font-extrabold text-white truncate">
                {newLabelText.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col items-start w-full gap-2">
              <span className="ml-1 text-sm text-slate-600">Title</span>
              <input
                className="w-full px-2 py-1 rounded-md border-[1px]"
                placeholder="Label title..."
                value={newLabelText}
                onChange={(e) => setNewLabelText(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center w-full gap-2">
              <span className="w-full ml-2 text-sm text-left text-slate-600">Select a color</span>
              <div className="w-full">
                <div className="flex justify-center w-full gap-2 px-1">
                  {swatches.slice(0, Math.ceil(swatches.length / 2))}
                </div>
                <div className="flex justify-center w-full gap-2 px-1 mt-2">
                  {swatches.slice(Math.ceil(swatches.length / 2))}
                </div>
              </div>
              <button
                onClick={() => setNewLabelColor('bg-slate-300')}
                className="flex items-center justify-center w-full gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200"
              >
                <div>
                  <XMarkIcon className="h-5" />
                </div>
                <span>Remove color</span>
              </button>
            </div>

            <button
              onClick={() => {
                isCreatingLabel ? handleCreate() : handleUpdate();
              }}
              className="px-2 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              {isCreatingLabel ? 'Create' : 'Update'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col w-full gap-2 mt-2">
            {/* <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search labels..."
              autoFocus
              className="w-full px-2 py-1 rounded-md border-[1px] border-slate-200"
            /> */}
            <div className="flex flex-col gap-2 overflow-hidden">
              {/* <span className="text-sm text-left text-slate-600">Labels</span> */}
              <div className="flex flex-col max-h-[24.5rem] gap-2 px-1 overflow-y-auto">
                {filteredLabels?.map((label) => (
                  <div key={label.id} className="flex items-center gap-2">
                    <Checkbox
                      onChange={() => toggleLabel(label.id)}
                      checked={labelIds.includes(label.id)}
                      data-testid={`label-checkbox-${label.id}`}
                    />
                    <div className={`w-full rounded-md h-8 ${label.color} truncate`}>
                      {label.title}
                    </div>
                    {/* <button className="flex p-1 rounded-md bg-slate-100 hover:bg-slate-200">
                      <PencilSquareIcon className="h-5" onClick={() => handlePencilClick(label)} />
                    </button> */}
                  </div>
                ))}
              </div>
              {/* <button
                onClick={() => setIsCreatingLabel(true)}
                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200"
              >
                <span>Create a new label</span>
              </button> */}
            </div>
          </div>
        )}
      </Popover.Panel>
    </Popover>
  );
};

export default LabelPopover;
