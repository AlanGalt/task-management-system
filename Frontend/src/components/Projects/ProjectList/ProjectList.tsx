import { useEffect, useState } from 'react';
import { Route, Routes, Link, useLocation, matchPath } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { serverTimestamp } from 'firebase/firestore';

import Project from '../Project';
import { ProjectData } from '../Project/Project.types';
import CreateProjectPopover from '../CreateProjectPopover';
import { auth } from '../../../App';
import useProjects from '../../../hooks/useProjects';
import NotFound from '../../../views/NotFound';
import Loader from '../../Loader';

const ProjectList = () => {
  const [openedProject, setOpenedProject] = useState<ProjectData | null>(null);
  const [user] = useAuthState(auth as any);
  // console.log(user);

  const { projects, addProject, updateProject, deleteProject } = useProjects();

  const location = useLocation();
  useEffect(() => {
    if (projects) {
      matchCurrentPathToProject();
    }
  }, [location, projects]);

  const matchCurrentPathToProject = () => {
    const match = matchPath({ path: '/dashboard/:projectId' }, location.pathname);

    const currentProject = projects.find((project) => project.id === match?.params.projectId);

    if (match && currentProject) {
      setOpenedProject(currentProject);
    }
  };

  const handleAddProject = async (newProject: Partial<ProjectData>) => {
    if (!user) return;
    await addProject({
      ...newProject,
      creatorId: user.uid,
      createdAt: serverTimestamp(),
      active: true,
      members: [
        {
          email: user.email ?? 'default user email',
          name: user.displayName ?? 'default user name',
          roleId: 'DEllHU6JjkL5iIKICuSY',
          uid: user.uid,
        },
      ],
      membersUid: [user.uid],
    });
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId);
    setOpenedProject(null);
  };

  return (
    <div className={'flex justify-center h-full p-2'}>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center w-full">
              <h2 className="text-2xl font-bold">Projects</h2>
              <div className="flex flex-row items-center w-full gap-4 p-8">
                {!!projects?.length &&
                  projects.map((project) => (
                    <Link
                      key={project.id}
                      className="h-32 px-4 py-2 overflow-hidden text-white break-words rounded-md w-52 bg-base-content hover:cursor-pointer"
                      onClick={() => setOpenedProject(project)}
                      to={`${project.id}`}
                    >
                      <div className="h-8 overflow-hidden text-lg break-words text-ellipsis whitespace-nowrap">
                        {project.title}
                      </div>
                    </Link>
                  ))}
                <CreateProjectPopover onSubmit={handleAddProject} />
              </div>
            </div>
          }
        />
        {openedProject && (
          <Route
            path="/:projectId"
            element={
              <Project
                projectData={openedProject}
                onDelete={handleDeleteProject}
                onUpdate={updateProject}
              />
            }
          />
        )}
        <Route
          path="*"
          element={projects.length ? <NotFound /> : <Loader className="w-full h-ful" />}
        />
      </Routes>
    </div>
  );
};

export default ProjectList;
