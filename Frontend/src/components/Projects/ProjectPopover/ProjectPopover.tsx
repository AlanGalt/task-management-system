import React, { useState } from 'react';
import { Popover } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';

import { ProjectPopoverProps } from './ProjectPopover.types';
import { ProjectData } from '../Project/Project.types';

const ProjectPopover = ({ onSubmit }: ProjectPopoverProps) => {
  const [projectData, setProjectData] = useState<ProjectData>({ title: '', description: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(projectData);
    setProjectData({ title: '', description: '' });
  };

  return (
    <Popover>
      <div className="flex items-center justify-center h-32 rounded-md w-52 bg-base-200">
        <Popover.Button className="w-16 h-16 p-2 text-center bg-green-400 rounded-full outline-none hover:bg-green-500 hover:cursor-pointer text-base-content">
          <PlusIcon />
        </Popover.Button>
      </div>
      <Popover.Panel className="absolute z-10 -translate-x-1/2 -translate-y-1/2 border-2 border-base-300 bg-base-100 top-1/2 left-1/2">
        {({ close }) => (
          <form
            className="flex flex-col p-4 space-y-2"
            onSubmit={(e) => {
              handleSubmit(e);
              close();
            }}
          >
            <label htmlFor="title" className="font-medium">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={projectData.title}
              onChange={handleChange}
              className="p-2 border border-gray-400 rounded-md"
              required
            />
            <label htmlFor="description" className="font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={projectData.description}
              onChange={handleChange}
              rows={3}
              className="p-2 border border-gray-400 rounded-md resize-none"
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="p-2 text-white bg-green-400 rounded-md hover:bg-green-500 border-base-content"
              >
                Create
              </button>
            </div>
          </form>
        )}
      </Popover.Panel>
    </Popover>
  );
};

export default ProjectPopover;
