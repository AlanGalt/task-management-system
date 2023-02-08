import { useState } from 'react';

import List from '../List';
import { ProjectProps } from './Project.types';

const Project = ({ title, onRemove, onReturn }: ProjectProps) => {
  const [lists, setLists] = useState<string[]>([]);

  function addList(list: string) {
    setLists([...lists, list]);
  }

  function handleRemoveList(listIndex: number) {
    setLists(lists.filter((list, index) => index !== listIndex));
  }

  return (
    <div className="flex flex-col bg-base-300">
      <h2>{title}</h2>
      {lists.map((list, index) => (
        <List key={index} title={list} onRemove={() => handleRemoveList(index)} />
      ))}
      <input
        type="text"
        placeholder="New list"
        onKeyPress={(e) => e.key === 'Enter' && addList(e.target.value)}
        className="w-36"
      />

      <button onClick={onRemove} className="w-fit">
        Remove Project
      </button>
      <button onClick={onReturn} className="w-fit">
        Return
      </button>
    </div>
  );
};

export default Project;
