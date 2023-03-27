import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

import List from '../../List';
import { ProjectProps } from './Project.types';

const Project = ({ projectData, onRemove }: ProjectProps) => {
  const { title, description } = projectData;

  const [lists, setLists] = useState<string[]>([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [projectTitle, setProjectTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const addList = (list: string) => {
    if (!list) return;
    setLists([...lists, list]);
    setNewListTitle('');
  };

  //TODO: fix the remove bug on all remove function
  const removeList = (listIndex: number) => {
    setLists((prevLists) => prevLists.filter((_, index) => index !== listIndex));
  };

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className="flex items-center justify-between w-full gap-2 mb-4">
        {/* TODO: make input auto stretch to fit title */}
        <input
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className={`text-2xl px-2 font-bold rounded-md ${
            isEditingTitle ? 'bg-white' : 'bg-transparent cursor-pointer'
          }`}
          onBlur={() => setIsEditingTitle(false)}
          onClick={() => setIsEditingTitle(true)}
          readOnly={!isEditingTitle}
        />
        <button
          onClick={onRemove}
          className="p-1 font-semibold text-white bg-red-500 rounded-md w-9 h-9 hover:bg-red-600"
        >
          <TrashIcon />
        </button>
      </div>
      {/* TODO: make scroll span from end to end of it's container & at the bottom*/}
      <div className="flex h-full gap-2 overflow-x-auto">
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
