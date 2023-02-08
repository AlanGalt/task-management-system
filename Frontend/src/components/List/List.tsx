import { useState } from 'react';

import Task from '../Task';

import { ListProps } from './List.types';

const List = ({ title, onRemove }: ListProps) => {
  const [tasks, setTasks] = useState<string[]>([]);

  function addTask(task: string) {
    setTasks([...tasks, task]);
  }

  function handleRemoveTask(taskIndex: number) {
    setTasks(tasks.filter((task, index) => index !== taskIndex));
  }

  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {tasks.map((task, index) => (
          <Task key={index} title={task} onRemove={() => handleRemoveTask(index)} />
        ))}
      </ul>
      <input
        type="text"
        placeholder="New task"
        onKeyPress={(e) => e.key === 'Enter' && addTask(e.target.value)}
      />
      <button onClick={onRemove}>Remove List</button>
    </div>
  );
};

export default List;
