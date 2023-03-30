import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3BottomLeftIcon,
  CalendarIcon,
  TagIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import TextareaAutosize from 'react-textarea-autosize';
import classNames from 'classnames';

interface TaskDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  listTitle: string;
  onClose: () => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  onDelete: () => void;
}

export const TaskDialog = ({
  isOpen,
  title,
  description,
  listTitle,
  onClose,
  setTitle,
  setDescription,
  onDelete,
}: TaskDialogProps) => {
  const [taskTitle, setTaskTitle] = useState(title);
  const [taskDescription, setTaskDescription] = useState(description);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const handeDescriptionBlur = () => {
    setIsEditingDescription(false);
    setDescription(taskDescription);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    setTitle(taskTitle);
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4">
                <Dialog.Panel className="relative flex w-1/2 gap-6 px-8 py-6 mx-auto bg-white rounded-md text-base-content">
                  <button
                    onClick={onClose}
                    className="absolute p-2 rounded-full top-1 right-1 w-fit hover:bg-gray-200"
                  >
                    <XMarkIcon className="h-5" />
                  </button>
                  <div className="w-full">
                    <div className="flex flex-col items-start mb-8">
                      <input
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        className={classNames(
                          { 'bg-transparent cursor-pointer outline-none': !isEditingTitle },
                          'text-xl w-[calc(100%-5px)] px-2 -ml-2 font-medium rounded-md'
                        )}
                        onBlur={handleTitleBlur}
                        onClick={() => setIsEditingTitle(true)}
                        readOnly={!isEditingTitle}
                      />
                      <span className="font-light cursor-default text-slate-600">
                        in list <strong>{listTitle}</strong>
                      </span>
                    </div>
                    <div className="flex w-full gap-6">
                      <div className="flex flex-col items-start w-full gap-2">
                        <div className="flex items-center gap-2">
                          <Bars3BottomLeftIcon className="h-5" />
                          <label htmlFor="project-description" className="font-medium">
                            Description
                          </label>
                        </div>
                        {!isEditingDescription && description && (
                          <p
                            onClick={() => setIsEditingDescription(true)}
                            className="font-light text-left cursor-pointer"
                          >
                            {description}
                          </p>
                        )}
                        {(isEditingDescription || !description) && (
                          // TODO: change to a text editor
                          <TextareaAutosize
                            id="task-description"
                            value={taskDescription}
                            placeholder="Describe what the task is about..."
                            onChange={(e) => setTaskDescription(e.target.value)}
                            className={classNames(
                              {
                                'outline-none cursor-pointer hover:bg-slate-200 bg-slate-100':
                                  !isEditingDescription,
                              },
                              'w-full px-3 py-2 border border-gray-300 rounded-md resize-none font-light'
                            )}
                            readOnly={!isEditingDescription}
                            onClick={() => setIsEditingDescription(true)}
                            onBlur={handeDescriptionBlur}
                            autoFocus
                          />
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-3 mt-8">
                        <div className="flex flex-col items-center gap-2 pb-3 border-b-2 border-slate-300">
                          <button className="flex items-center justify-start w-32 gap-2 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800">
                            <UserPlusIcon className="h-5" />
                            <span>Assign</span>
                          </button>
                          <button className="flex items-center justify-start w-32 gap-2 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800">
                            <CalendarIcon className="h-5" />
                            <span>Set date</span>
                          </button>
                          <button className="flex items-center justify-start w-32 gap-2 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800">
                            <TagIcon className="h-5" />
                            <span>Label</span>
                          </button>
                        </div>
                        <button
                          onClick={onDelete}
                          className="flex items-center justify-start w-32 gap-2 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800"
                        >
                          <TrashIcon className="h-5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaskDialog;
