import classNames from 'classnames';

import { useState } from 'react';

import Project from '../Project';
import { ProjectData } from '../Project/Project.types';
import ProjectPopover from '../ProjectPopover';

const ProjectList = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const [openedProject, setOpenedProject] = useState<number | null>(null);

  const addProject = (newProject: ProjectData) => {
    setProjects([...projects, newProject]);
  };

  const removeProject = (projectIndex: number) => {
    setProjects(projects.filter((project, index) => index !== projectIndex));
  };

  return (
    <>
      <div className={'flex justify-center h-full p-2'}>
        {openedProject !== null ? (
          <Project
            projectData={projects[openedProject]}
            onRemove={() => {
              removeProject(openedProject);
              setOpenedProject(null);
            }}
          />
        ) : (
          // add 3 dots in top right corner for delete edit etc
          <div className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-bold">Projects</h2>
            <div className="flex flex-row items-center w-full gap-4 p-8">
              {!!projects.length &&
                projects.map((project, index) => (
                  <div
                    key={index}
                    className="h-32 px-4 py-2 overflow-hidden text-white break-words rounded-md w-52 bg-base-content hover:cursor-pointer"
                    onClick={() => setOpenedProject(index)}
                  >
                    <div className="h-8 overflow-hidden text-lg break-words text-ellipsis whitespace-nowrap">
                      {project.title}
                    </div>
                  </div>
                ))}
              <ProjectPopover onSubmit={(newProject) => addProject(newProject)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectList;
