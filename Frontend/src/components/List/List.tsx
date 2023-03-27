import { TrashIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useState } from 'react';

import Task from '../Task';

import { ListProps } from './List.types';

const List = ({ title, onRemove }: ListProps) => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [listTitle, setListTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const addTask = (task: string) => {
    if (!task) return;
    setTasks([...tasks, task]);
    setNewTaskTitle('');
  };

  const removeTask = (taskIndex: number) => {
    setTasks(tasks.filter((task, index) => index !== taskIndex));
  };

  return (
    <div className="flex flex-col flex-shrink-0 gap-2 p-2 rounded-md bg-base-300 w-72 h-fit">
      <div className="flex justify-between gap-2 font-bold">
        <input
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          className={`w-full px-2 rounded-md ${
            isEditingTitle ? 'bg-white' : 'bg-transparent cursor-pointer outline-none'
          }`}
          onBlur={() => setIsEditingTitle(false)}
          onClick={() => setIsEditingTitle(true)}
          readOnly={!isEditingTitle}
        />
        <button onClick={onRemove} className="p-1 rounded-md hover:cursor-pointer hover:bg-white">
          <TrashIcon className="h-5" />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task, index) => (
          <Task key={index} title={task} onRemove={() => removeTask(index)} />
        ))}
        <input
          type="text"
          placeholder="New task"
          className="w-full p-2 rounded-md"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask(newTaskTitle)}
        />
      </div>
    </div>
  );
};

export default List;
