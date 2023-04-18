import { Popover, Transition } from '@headlessui/react';
import {
  ArrowRightOnRectangleIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import { Fragment, useEffect, useState } from 'react';

import EditableDescription from '../../EditableDescription';

import { Permission } from '../Project/Project.types';
import { ProjectMenuProps } from './ProjectMenu.types';

// TODO: pick a better name
const ProjectMenu = ({
  description,
  permit,
  onDelete,
  onLeave,
  updateDescription,
}: ProjectMenuProps) => {
  const [projectDescription, setProjectDescription] = useState(description);

  useEffect(() => {
    if (description === projectDescription) return;

    setProjectDescription(description);
  }, [description]);

  const handleDescriptionBlur = () => {
    if (description === projectDescription) return;

    updateDescription(projectDescription);
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
        <Popover.Panel className="flex flex-col items-center absolute right-0 z-10 top-[calc(100%+4px)] shadow-xl bg-white w-max p-4">
          <EditableDescription
            title="project"
            description={projectDescription}
            hasPermission={permit[Permission.EditProject]}
            setDescription={setProjectDescription}
            onBlur={handleDescriptionBlur}
          />
          {permit[Permission.DeleteProject] && (
            <div className="flex items-center justify-between w-full gap-8 pb-4 mt-4 border-b-2 border-slate-200">
              <div className="flex flex-col">
                <span className="font-medium">Delete this project</span>
                <span>
                  Once you delete a project, there is no going back. <br /> Please be certain.
                </span>
              </div>
              <button
                onClick={onDelete}
                className="flex items-center justify-center gap-1 px-2 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600 h-fit"
              >
                <TrashIcon className="h-5" />
                <span>Delete</span>
              </button>
            </div>
          )}
          <div className="flex items-center justify-between w-full gap-8 mt-4">
            <div className="flex flex-col">
              <span className="font-medium">Leave the project</span>
              <span>You will have to be invited to join again.</span>
            </div>
            <button
              onClick={onLeave}
              className="flex items-center justify-center gap-1 px-2 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600 h-fit"
            >
              <ArrowRightOnRectangleIcon className="h-5" />
              <span>Leave</span>
            </button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default ProjectMenu;
