import { useState } from 'react';

import Task from '../Task';

import { ListProps } from './List.types';

const List = ({ title, onRemove }: ListProps) => {
  const [tasks, setTasks] = useState<string[]>(['task1', 'task2']);

  function addTask(task: string) {
    setTasks([...tasks, task]);
  }

  function handleRemoveTask(taskIndex: number) {
    setTasks(tasks.filter((task, index) => index !== taskIndex));
  }

  return (
    <div className="p-2 rounded-md bg-base-300 w-72">
      <div className="p-2 font-bold">
        <h3>{title}</h3>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task, index) => (
          <Task key={index} title={task} onRemove={() => handleRemoveTask(index)} />
        ))}
      </div>
      {/* <input
        type="text"
        placeholder="New task"
        onKeyPress={(e) => e.key === 'Enter' && addTask(e.target.value)}
      /> */}
      {/* <button onClick={onRemove}>Remove List</button> */}
    </div>
  );
};

export default List;
