import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FunnelIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import * as _ from 'lodash-es';
import { serverTimestamp, Timestamp } from 'firebase/firestore';

import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import List from '../../List';
import {
  ProjectProps,
  ProjectData,
  Permission,
  PermissionData,
  Permit,
  Member,
  Role,
  ListTasks,
} from './Project.types';
import ProjectMenu from '../ProjectMenu';

import MembersDialog from '../MembersDialog';
import { auth } from '../../../App';
import useProjectLists from '../../../hooks/useProjectLists';
import { ListData } from '../../List/List.types';
import useProjectTasks from '../../../hooks/useProjectTasks';
import MembersContext from '../../../contexts/MembersContext';
import { TaskData } from '../../Task/Task.types';
import LabelsContext from '../../../contexts/LabelsContext';

const getPermissionStatus = (permissions: PermissionData[]) => {
  const initialPermissionStatus = Object.fromEntries(
    Object.values(Permission).map((permissionName) => [permissionName, false])
  ) as Permit;

  const accumulatePermissions = (acc: Permit, p: PermissionData) => {
    acc[p.name as keyof Permit] = true;
    return acc;
  };

  const permissionStatus = permissions.reduce(accumulatePermissions, initialPermissionStatus);

  return permissionStatus;
};

const Project = ({ projectData, defaultRoles, onDelete, onUpdate, removeMember }: ProjectProps) => {
  const { id, title, description, members, roles, membersUid, labels } = projectData;
  const { lists, addList, updateList, reorderLists, deleteList } = useProjectLists(id);
  const { tasks, addTask, updateTask, reorderTasks, deleteTask } = useProjectTasks(id);
  const [projectLists, setProjectLists] = useState(lists);
  const [projectTasks, setProjectTasks] = useState<ListTasks>(new Map<string, TaskData[]>());

  useEffect(() => {
    if (!lists) return;

    setProjectLists(lists);
  }, [lists]);

  useEffect(() => {
    if (!tasks) return;

    const tasksByList = tasks.reduce((map, task) => {
      const listTasks = map.get(task.listId) || [];
      listTasks.push(task);
      map.set(task.listId, listTasks);
      return map;
    }, new Map<string, TaskData[]>());

    setProjectTasks(tasksByList);
  }, [tasks]);

  const allRoles = [...defaultRoles, ...roles];

  const [user] = useAuthState(auth as any);

  const sortedMembers = members
    .slice()
    .sort((a, b) => (a.uid === user?.uid ? -1 : b.uid === user?.uid ? 1 : 0));

  const [newListTitle, setNewListTitle] = useState('');
  const [projectTitle, setProjectTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const addListButtonRef = useRef<HTMLButtonElement | null>(null);
  const addListInputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (title === projectTitle) return;

    setProjectTitle(title);
  }, [title]);

  const userRoleName = members.find((m) => m.uid === user?.uid)?.roleName;
  const userRole = allRoles.find((r) => r.name === userRoleName);

  const permit = userRole ? getPermissionStatus(userRole?.permissions) : ({} as Permit);

  const handleAddList = () => {
    if (!newListTitle || !lists || !projectLists) return;

    const newList = {
      id: '', // fake id for typescript
      active: true,
      index: lists.length,
      createdAt: serverTimestamp() as Timestamp,
      projectId: id,
      title: newListTitle,
    } as ListData;

    setNewListTitle('');
    addListInputRef.current?.focus();
    setProjectLists([...projectLists, newList]);
    addList(newList);
  };

  const handleAddListBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (addListButtonRef.current?.contains(e.relatedTarget)) return;

    setIsAddingList(false);
    setNewListTitle('');
  };

  const updateTitle = () => {
    setIsEditingTitle(false);

    if (projectTitle === title) return;

    onUpdate({ title: projectTitle });
  };

  const updateDescription = (newDescription: string) => {
    onUpdate({ description: newDescription });
  };

  const deleteProject = () => {
    onDelete();
    navigate('/');
  };

  const leaveProject = () => {
    // TODO: if you're the last to leave - delete the project
    const updatedMembers = members.filter((m) => m.uid !== user?.uid);
    const updatedMembersUid = membersUid.filter((uid) => uid !== user?.uid);

    if (updatedMembers.length === members.length) return;

    onUpdate({ members: updatedMembers, membersUid: updatedMembersUid });
    navigate('/');
  };

  const setMembers = (updatedMembers: Member[]) => {
    if (_.isEqual(members, updatedMembers)) return;

    const newData = {} as Partial<ProjectData>;
    newData.members = updatedMembers;
    newData.membersUid = updatedMembers.map((m) => m.uid);

    onUpdate(newData);
  };

  const setRoles = (updatedRoles: Role[]) => {
    if (_.isEqual(roles, updatedRoles)) return;

    onUpdate({ roles: updatedRoles });
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    const { destination, source, type } = result;

    // Check if the drop destination is valid
    if (
      !destination ||
      (destination.droppableId === source.droppableId && destination.index === source.index)
    ) {
      return;
    }

    if (type === 'lists' && lists) {
      const newListOrder = Array.from(lists);
      const [removedList] = newListOrder.splice(source.index, 1);
      newListOrder.splice(destination.index, 0, removedList);

      const updatedIndexesLists = newListOrder.map((list, index) => ({
        ...list,
        index,
      }));

      setProjectLists(updatedIndexesLists);
      reorderLists(updatedIndexesLists);
      return;
    }

    if (type === 'tasks' && tasks) {
      const sourceListId = source.droppableId;
      const destinationListId = destination.droppableId;

      const sourceTasks = projectTasks.get(sourceListId);
      const destinationTasks = projectTasks.get(destinationListId);

      if (!sourceTasks) {
        return;
      }

      if (sourceListId === destinationListId) {
        const reorderedTasks = Array.from(sourceTasks);
        const [movedTask] = reorderedTasks.splice(source.index, 1);
        reorderedTasks.splice(destination.index, 0, movedTask);

        const newProjectTasks = new Map(projectTasks);
        newProjectTasks.set(sourceListId, reorderedTasks);

        setProjectTasks(newProjectTasks);
        return;
      }

      const newSourceTasks = Array.from(sourceTasks);
      const newDestinationTasks = Array.from(destinationTasks ?? []);

      const [movedTask] = newSourceTasks.splice(source.index, 1);
      newDestinationTasks.splice(destination.index, 0, movedTask);

      const newProjectTasks = new Map(projectTasks);
      newProjectTasks.set(sourceListId, newSourceTasks);
      newProjectTasks.set(destinationListId, newDestinationTasks);

      setProjectTasks(newProjectTasks);
      reorderTasks(newProjectTasks, sourceListId, destinationListId);
    }
  };

  const handleDeleteList = (listId: string) => {
    if (!projectLists) return;

    const updatedProjectLists = projectLists.filter((list) => list.id !== listId);
    setProjectLists(updatedProjectLists);

    const updatedProjectTasks = new Map(projectTasks);
    updatedProjectTasks.delete(listId);

    setProjectTasks(updatedProjectTasks);

    deleteList(listId, id);
  };

  const handleAddTask = (listId: string, newTask: TaskData) => {
    const updatedTasks = new Map(projectTasks);
    const tasksForList = updatedTasks.get(listId) || [];
    tasksForList.push(newTask);
    updatedTasks.set(listId, tasksForList);
    setProjectTasks(updatedTasks);
    addTask(newTask);
  };

  const handleDeleteTask = (listId: string, taskId: string) => {
    const updatedTasks = new Map(projectTasks);
    const updatedTaskList = updatedTasks.get(listId)?.filter((t) => t.id !== taskId);

    if (updatedTaskList) {
      updatedTasks.set(listId, updatedTaskList);
      setProjectTasks(updatedTasks);
    }

    deleteTask(taskId);
  };

  return (
    <LabelsContext.Provider value={labels}>
      <MembersContext.Provider value={sortedMembers}>
        <div className="flex flex-col w-full h-full p-4">
          <div className="flex items-center justify-between w-full mb-4">
            {/* TODO: make input auto stretch to fit title */}
            {/* TODO: extract this type of input as it's own component */}
            <input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className={classNames(
                {
                  'bg-transparent cursor-pointer outline-none hover:bg-slate-100':
                    !isEditingTitle && permit[Permission.EditProject],
                  'cursor-default outline-none': !permit[Permission.EditProject],
                },
                'text-2xl px-2 font-bold rounded-md truncate'
              )}
              onBlur={updateTitle}
              onClick={() => permit[Permission.EditProject] && setIsEditingTitle(true)}
              readOnly={!isEditingTitle || !permit[Permission.EditProject]}
            />
            <div className="relative flex gap-2">
              <div className="flex gap-2 pr-2 border-r-2 border-gray-200">
                <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 h-9 hover:bg-slate-200">
                  <FunnelIcon className="w-7 h-7" />
                  <span>Filter tasks</span>
                </button>
                {permit[Permission.ManageMembers] && (
                  <button
                    onClick={() => setIsMembersDialogOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 h-9 hover:bg-slate-200"
                  >
                    <UserIcon className="w-7 h-7" />
                    <span>Manage members</span>
                  </button>
                )}
              </div>
              <ProjectMenu
                description={description ?? ''}
                permit={permit}
                onDelete={deleteProject}
                onLeave={leaveProject}
                updateDescription={updateDescription}
              />
            </div>
          </div>
          {/* TODO: make scroll span from end to end of it's container & at the bottom*/}
          {/* TODO: implement rendering optimisations for drag and drop */}
          <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
            <div className="flex h-full max-h-full pb-1 overflow-x-auto overflow-y-hidden">
              <Droppable direction="horizontal" type="lists" droppableId="lists-droppable">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="flex">
                    {!!projectLists?.length &&
                      projectLists?.map((list) => (
                        <div key={list.id}>
                          <List
                            index={list.index}
                            listData={list}
                            permit={permit}
                            isDragging={isDragging}
                            tasks={projectTasks.get(list.id) ?? []}
                            addTask={(newTask) => handleAddTask(list.id, newTask)}
                            deleteTask={(taskId) => handleDeleteTask(list.id, taskId)}
                            updateTask={updateTask}
                            onDelete={() => handleDeleteList(list.id)}
                            onUpdate={(listData: Partial<ListData>) =>
                              updateList(list.id, listData)
                            }
                          />
                        </div>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {!isAddingList && permit[Permission.CreateLists] ? (
                <button
                  onClick={() => setIsAddingList(true)}
                  className="flex items-center flex-shrink-0 gap-1 p-2 rounded-md text-slate-500 hover:bg-slate-300 bg-slate-200 w-72 h-fit"
                >
                  <PlusIcon className="h-5" />
                  Add new list
                </button>
              ) : (
                permit[Permission.CreateLists] && (
                  // TODO: make add list form and list itself the same height
                  <div className="flex flex-col flex-shrink-0 gap-2 p-2 rounded-md bg-base-300 w-72 h-fit">
                    <input
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                      placeholder="New list"
                      className="w-full p-2 rounded-md"
                      onBlur={handleAddListBlur}
                      autoFocus
                      ref={addListInputRef}
                    />
                    <button
                      ref={addListButtonRef}
                      onClick={handleAddList}
                      className="px-3 py-1 text-white bg-green-400 rounded-md w-fit hover:bg-green-500"
                    >
                      Add list
                    </button>
                  </div>
                )
              )}
            </div>
          </DragDropContext>
        </div>

        <MembersDialog
          isOpen={isMembersDialogOpen}
          members={sortedMembers}
          roles={roles}
          defaultRoles={defaultRoles}
          setMembers={setMembers}
          setRoles={setRoles}
          removeMember={removeMember}
          onClose={() => setIsMembersDialogOpen(false)}
        />
      </MembersContext.Provider>
    </LabelsContext.Provider>
  );
};

export default Project;
