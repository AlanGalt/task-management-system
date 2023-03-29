import { EllipsisHorizontalIcon, PlusIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';

import Task from '../Task';

import { ListProps } from './List.types';

const List = ({ title, onRemove }: ListProps) => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [listTitle, setListTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const addTaskButtonRef = useRef<HTMLButtonElement | null>(null);
  const addTaskInputRef = useRef<HTMLInputElement | null>(null);

  const addNewTask = () => {
    if (!newTaskTitle) return;
    setTasks([...tasks, newTaskTitle]);
    setNewTaskTitle('');
    addTaskInputRef.current?.focus();
  };

  const removeTask = (taskIndex: number) => {
    setTasks(tasks.filter((task, index) => index !== taskIndex));
  };

  const handleAddTaskBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (addTaskButtonRef.current?.contains(e.relatedTarget)) return;

    setIsAddingTask(false);
    setNewTaskTitle('');
  };

  return (
    <div className="flex flex-col flex-shrink-0 gap-2 p-2 rounded-md bg-base-300 w-72 h-fit">
      <div className="flex justify-between gap-1 font-medium">
        <input
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          className={classNames(
            { 'bg-transparent cursor-pointer outline-none': !isEditingTitle },
            'w-full px-2 rounded-md'
          )}
          onBlur={() => setIsEditingTitle(false)}
          onClick={() => setIsEditingTitle(true)}
          readOnly={!isEditingTitle}
        />
        <button
          onClick={() => console.log('ADD LIST OPTIONS POPOVER HERE')}
          className="p-1 rounded-md hover:cursor-pointer hover:bg-white"
        >
          <EllipsisHorizontalIcon className="h-5" />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task, index) => (
          <Task key={index} title={task} onDelete={() => removeTask(index)} />
        ))}
        {!isAddingTask ? (
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center w-full gap-1 px-2 py-1 rounded-md text-slate-500 hover:bg-slate-300"
          >
            <PlusIcon className="h-5" />
            Add new task
          </button>
        ) : (
          <div>
            <input
              type="text"
              placeholder="New task"
              className="w-full p-2 rounded-md"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNewTask()}
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
    </div>
  );
};

export default List;
