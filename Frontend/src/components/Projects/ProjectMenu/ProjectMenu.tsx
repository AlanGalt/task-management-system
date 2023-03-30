import { Popover, Transition } from '@headlessui/react';
import {
  Bars3BottomLeftIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Fragment, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { ProjectMenuProps } from './ProjectMenu.types';

// TODO: pick a better name
const ProjectMenu = ({ description, onDelete, setDescription }: ProjectMenuProps) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [projectDescription, setProjectDescription] = useState(description);

  const handeDescriptionBlur = () => {
    setIsEditingDescription(false);
    setDescription(projectDescription);
  };

  return (
    <Popover>
      <Popover.Button className="p-1 rounded-md bg-slate-100 w-9 h-9 hover:bg-slate-200">
        <EllipsisHorizontalIcon />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition duration-100 ease-in-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel className="flex flex-col gap-2 items-center absolute right-0 z-10 top-[calc(100%+4px)] shadow-xl bg-white w-max p-4">
          <div className="flex flex-col items-start w-full gap-2 pb-2 border-b-2 border-slate-200">
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
                id="project-description"
                value={projectDescription}
                placeholder="Describe what this project is about..."
                onChange={(e) => setProjectDescription(e.target.value)}
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
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <label htmlFor="project-description" className="font-medium">
                Delete this project
              </label>
              <span>
                Once you delete a project, there is no going back. <br /> Please be certain.
              </span>
            </div>
            <button
              id="project-delete"
              onClick={onDelete}
              className="flex items-center justify-center gap-1 px-2 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600 h-fit"
            >
              <TrashIcon className="h-5" />
              <span>Delete</span>
            </button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default ProjectMenu;
