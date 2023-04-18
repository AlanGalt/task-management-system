import { useEffect, useState } from 'react';
import { Route, Routes, Link, useLocation, matchPath } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import Project from '../Project';
import { DefaultRole, LabelColor, ProjectData } from '../Project/Project.types';
import CreateProjectPopover from '../CreateProjectPopover';
import { auth } from '../../../App';
import useProjects from '../../../hooks/useProjects/useProjects';
import NotFound from '../../../views/NotFound';
import Loader from '../../Loader';
import useDefaultRoles from '../../../hooks/useDefaultRoles';
import { LabelData } from '../../Task/Task.types';

const ProjectList = () => {
  const [openedProject, setOpenedProject] = useState<ProjectData | null>(null);
  const [showNotFound, setShowNotFound] = useState(false);

  const [user] = useAuthState(auth as any);
  const { projects, addProject, updateProject, deleteProject, removeMember } = useProjects();
  const defaultRoles = useDefaultRoles();
  const location = useLocation();

  useEffect(() => {
    if (projects) {
      matchCurrentPathToProject();
    }
  }, [location, projects]);

  const matchCurrentPathToProject = () => {
    const match = matchPath({ path: '/dashboard/:projectId' }, location.pathname);
    const currentProject = projects?.find((project) => project.id === match?.params.projectId);
    const doesMatch = !!match && !!currentProject;

    if (doesMatch) {
      setOpenedProject(currentProject);
      setShowNotFound(false);
      return;
    }

    setShowNotFound(true);
  };

  const handleAddProject = async (newProject: Partial<ProjectData>) => {
    if (!user) return;

    await addProject({
      ...newProject,
      title: newProject.title?.trim(),
      creatorId: user.uid,
      createdAt: serverTimestamp() as Timestamp,
      active: true,
      members: [
        {
          email: user.email ?? 'default user email',
          name: user.displayName ?? 'default user name',
          roleName: DefaultRole.Admin,
          uid: user.uid,
          photoURL: user.photoURL ?? '',
        },
      ],
      membersUid: [user.uid],
      roles: [],
      labels: Object.values(LabelColor).map((color) => {
        return {
          id: uuidv4(),
          color: color,
          title: '',
        } as LabelData;
      }),
    });
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId);
    setOpenedProject(null);
  };

  return (
    <div className="flex justify-center h-full">
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center w-full">
              <h2 className="mt-2 text-2xl font-bold">Projects</h2>
              <div className="flex flex-row flex-wrap items-center w-full gap-4 p-8">
                {!!projects?.length &&
                  projects.map((project) => (
                    <Link
                      key={project.id}
                      className="w-56 h-32 px-4 py-2 text-white rounded-md bg-base-content hover:cursor-pointer"
                      onClick={() => setOpenedProject(project)}
                      to={`${project.id}`}
                    >
                      <p className="h-8 text-lg truncate">{project.title}</p>
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
                defaultRoles={defaultRoles ?? []}
                onDelete={() => handleDeleteProject(openedProject.id)}
                onUpdate={(updatedData: Partial<ProjectData>) =>
                  updateProject(openedProject.id, updatedData)
                }
                removeMember={(memberUid: string) => removeMember(openedProject.id, memberUid)}
              />
            }
          />
        )}
        <Route
          path="*"
          element={showNotFound ? <NotFound /> : <Loader className="w-full h-full" />}
        />
      </Routes>
    </div>
  );
};

export default ProjectList;
