import { Popover } from '@headlessui/react';
import classNames from 'classnames';

import { useEffect, useState } from 'react';

import Project from '../Project';

const ProjectList = () => {
  const [projects, setProjects] = useState<string[]>([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // const [newProjectTitle, setNewProjectTitle] = useState('');
  const [openedProject, setOpenedProject] = useState<number | null>(null);

  // function addProject(newProject: string) {
  //   setProjects([...projects, newProject]);
  // }

  function handleRemoveProject(projectIndex: number) {
    setProjects(projects.filter((project, index) => index !== projectIndex));
  }

  // function handleNewProjectTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   setNewProjectTitle(e.target.value);
  // }
  useEffect(() => {
    console.log(isCreatingProject);
  }, [isCreatingProject]);

  return (
    <>
      <div
        className={classNames('flex justify-center h-full p-2', {
          'bg-base-300': openedProject !== null,
        })}
      >
        {openedProject !== null ? (
          <Project
            title={projects[openedProject]}
            onRemove={() => {
              handleRemoveProject(openedProject);
              setOpenedProject(null);
            }}
            onReturn={() => setOpenedProject(null)}
          />
        ) : (
          <div className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-bold">Projects</h2>
            <div className="flex flex-row items-start w-full gap-4 p-8">
              {!!projects.length &&
                projects.map((project, index) => (
                  <div
                    key={index}
                    className="h-32 px-4 py-2 overflow-hidden break-words rounded-md w-52 bg-base-content hover:cursor-pointer text-base-100"
                    onClick={() => setOpenedProject(index)}
                  >
                    <div className="h-8 overflow-hidden text-lg break-words text-ellipsis whitespace-nowrap">
                      {project}
                    </div>
                  </div>
                ))}
              <Popover>
                <Popover.Button
                  className="h-32 px-2 py-1 text-center rounded-md outline-none hover:cursor-pointer w-52 bg-base-400 text-base-content"
                  onClick={() => {
                    setIsCreatingProject(true);
                    console.log(isCreatingProject);
                  }}
                >
                  Add new project
                </Popover.Button>
                <Popover.Panel className="absolute z-10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  Project Popover here
                </Popover.Panel>
              </Popover>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectList;
