import classNames from 'classnames';

import { useState } from 'react';

import Project from '../Project';
import ProjectPopover from '../ProjectPopover/ProjectPopover';

const ProjectList = () => {
  const [projects, setProjects] = useState<string[]>([]);

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
                  // Project.name
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
              <ProjectPopover />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectList;
