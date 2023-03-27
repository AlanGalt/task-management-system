import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

import List from '../../List';
import { ProjectProps } from './Project.types';
import classNames from 'classnames';

const Project = ({ projectData, onRemove }: ProjectProps) => {
  const [lists, setLists] = useState<string[]>([]);
  const [newListTitle, setNewListTitle] = useState('');
  const { title, description } = projectData;

  const addList = (list: string) => {
    setLists([...lists, list]);
    setNewListTitle('');
  };

  const removeList = (listIndex: number) => {
    setLists(lists.filter((list, index) => index !== listIndex));
  };

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className="flex items-center justify-between w-full gap-2 mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button
          onClick={onRemove}
          className="p-1 font-semibold text-white bg-red-500 rounded-md w-9 h-9 hover:bg-red-600"
        >
          <TrashIcon />
        </button>
      </div>
      {/* TODO: make scroll span from end to end of it's container & at the bottom*/}
      <div className={classNames({ 'gap-2': lists.length }, 'flex overflow-x-auto h-full')}>
        {lists.map((list, index) => (
          <List key={index} title={list} onRemove={() => removeList(index)} />
        ))}
        <div className="flex flex-col flex-shrink-0 gap-2 p-2 bg-white border rounded-md border-base-300 w-72 h-fit">
          <input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addList(newListTitle)}
            placeholder="New list"
            className="w-full px-2 py-1 border rounded-md border-base-300"
            required
          />
          <button
            onClick={() => addList(newListTitle)}
            className="px-2 py-1 bg-green-300 rounded-md hover:bg-green-400 w-fit"
          >
            Add list
          </button>
        </div>
      </div>
    </div>
  );
};

export default Project;
