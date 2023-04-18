import { PlusIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { Permission } from '../Projects/Project/Project.types';
import Task from '../Task';
import { TaskData } from '../Task/Task.types';
import { ListProps } from './List.types';
import ListPopover from './ListPopover';

const List = ({
  listData,
  permit,
  tasks,
  index,
  isDragging,
  onDelete,
  onUpdate,
  addTask,
  updateTask,
  deleteTask,
}: ListProps) => {
  const { id, projectId, title } = listData;
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [listTitle, setListTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const addTaskButtonRef = useRef<HTMLButtonElement | null>(null);
  const addTaskInputRef = useRef<HTMLInputElement | null>(null);
  const tasksRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (title === listTitle) return;

    setListTitle(title);
  }, [title]);

  const scrollToTheBottom = () => {
    if (!tasksRef.current || !addTaskButtonRef.current) return;

    tasksRef.current.scrollTop = tasksRef.current.scrollHeight;
  };

  useLayoutEffect(() => {
    if (!tasksRef.current || !isAddingTask) return;

    scrollToTheBottom();
  }, [isAddingTask, tasks.length]);

  const addNewTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: '', // fake id for typescript
      index: tasks.length,
      active: true,
      assignedMembersUid: [] as string[],
      completed: false,
      createdAt: serverTimestamp() as Timestamp,
      labelIds: [],
      title: newTaskTitle.trim(),
      listId: id,
      projectId: projectId,
    } as TaskData;

    addTask(newTask);
    setNewTaskTitle('');
    addTaskInputRef.current?.focus();
  };

  const handleAddTaskBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (addTaskButtonRef.current?.contains(e.relatedTarget)) return;

    setIsAddingTask(false);
    setNewTaskTitle('');
  };

  const handleListTitleBlur = () => {
    setIsEditingTitle(false);

    if (title === listTitle) return;

    onUpdate({ title: listTitle });
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          className={classNames({ 'pointer-events-none': isDragging }, 'flex-shrink-0 h-full mr-2')}
          {...(permit[Permission.EditLists] && provided.draggableProps)}
          ref={provided.innerRef}
        >
          <div className="flex flex-col max-h-full p-1 pb-2 rounded-md bg-base-300 w-72">
            <div
              {...provided.dragHandleProps}
              className="flex items-center justify-between gap-1 px-1 py-2 !cursor-pointer"
              onClick={() => permit[Permission.EditLists] && setIsEditingTitle(!isEditingTitle)}
            >
              {isEditingTitle ? (
                <input
                  value={listTitle}
                  autoFocus
                  onChange={(e) => setListTitle(e.target.value)}
                  className="w-full px-2 font-medium truncate rounded-md"
                  onBlur={handleListTitleBlur}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <p className={classNames('w-full px-2 truncate font-medium')}>{listTitle}</p>
              )}
              {permit[Permission.EditLists] && <ListPopover permit={permit} onDelete={onDelete} />}
              {/* TODO: ADD CONFIRM DIALOG */}
            </div>

            <div className="relative flex flex-col max-h-full overflow-hidden">
              <div ref={tasksRef} className="max-h-full overflow-x-hidden overflow-y-auto">
                <Droppable direction="vertical" type="tasks" droppableId={id}>
                  {(droppableProvided) => (
                    <>
                      <div className="flex flex-col px-1 pt-1 ">
                        <div>
                          {tasks.map((task, index) => (
                            <Task
                              key={task.id}
                              index={index}
                              taskData={task}
                              listTitle={title}
                              permit={permit}
                              onDelete={() => deleteTask(task.id)}
                              onUpdate={(updatedTaskData: Partial<TaskData>) =>
                                updateTask(task.id, updatedTaskData)
                              }
                            />
                          ))}
                          {droppableProvided.placeholder}
                        </div>
                        {isAddingTask && permit[Permission.CreateTasks] && (
                          <div>
                            <input
                              type="text"
                              placeholder="New task"
                              className="w-full p-2 rounded-md"
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && addNewTask()}
                              autoFocus
                              onBlur={handleAddTaskBlur}
                              ref={addTaskInputRef}
                            />
                            <button
                              ref={addTaskButtonRef}
                              onClick={addNewTask}
                              className="px-3 py-1 mt-2 text-white bg-green-400 rounded-md hover:bg-green-500"
                            >
                              Add task
                            </button>
                          </div>
                        )}
                      </div>
                      <div
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                        className="absolute top-0 w-full h-screen pt-1 pl-2 opacity-50 -z-10 -left-1 -right-1"
                      ></div>
                    </>
                  )}
                </Droppable>
              </div>
            </div>
            {!isAddingTask && permit[Permission.CreateTasks] && (
              <div className="px-1">
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="flex items-center w-full gap-1 px-2 py-1 rounded-md text-slate-500 hover:bg-slate-300"
                >
                  <PlusIcon className="h-5" />
                  Add new task
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default List;
