import { useRef, useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import List from '../../List';
import { ProjectProps } from './Project.types';

const Project = ({ projectData, onRemove }: ProjectProps) => {
  const { title, description } = projectData;

  const [lists, setLists] = useState<string[]>([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [projectTitle, setProjectTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);

  const addListButtonRef = useRef<HTMLButtonElement | null>(null);
  const addListInputRef = useRef<HTMLInputElement | null>(null);

  const addList = () => {
    if (!newListTitle) return;
    setLists([...lists, newListTitle]);
    setNewListTitle('');
    addListInputRef.current?.focus();
  };

  //TODO: fix the remove bug on all remove function
  const removeList = (listIndex: number) => {
    setLists((prevLists) => prevLists.filter((_, index) => index !== listIndex));
  };

  const handleAddListBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (addListButtonRef.current?.contains(e.relatedTarget)) return;

    setIsAddingList(false);
    setNewListTitle('');
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

        {!isAddingList ? (
          <button
            onClick={() => setIsAddingList(true)}
            className="flex items-center flex-shrink-0 gap-1 p-2 rounded-md text-slate-500 hover:bg-slate-300 bg-slate-200 w-72 h-fit"
          >
            <PlusIcon className="h-5" />
            Add new list
          </button>
        ) : (
          // TODO: make add list form and list itself the same height
          <div className="flex flex-col flex-shrink-0 gap-2 p-2 rounded-md bg-base-300 w-72 h-fit">
            <input
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addList()}
              placeholder="New list"
              className="w-full p-2 rounded-md"
              onBlur={handleAddListBlur}
              autoFocus
              ref={addListInputRef}
            />
            <button
              ref={addListButtonRef}
              onClick={addList}
              className="px-2 py-1 bg-green-300 rounded-md hover:bg-green-400 w-fit"
            >
              Add list
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Project;
