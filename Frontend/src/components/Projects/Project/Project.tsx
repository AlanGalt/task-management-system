import { useRef, useState } from 'react';
import { FunnelIcon, PlusIcon, UserIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

import List from '../../List';
import { ProjectProps } from './Project.types';
import ProjectMenu from '../ProjectMenu';

const Project = ({ projectData, onDelete }: ProjectProps) => {
  const { title, description } = projectData;

  // temporary solution to test the ui
  // TODO: remove this
  const [projectDescription, setProjectDescription] = useState(description);

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
        {/* TODO: extract this type of input as it's own component */}
        <input
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className={classNames(
            { 'bg-transparent cursor-pointer outline-none': !isEditingTitle },
            'text-2xl px-2 font-bold rounded-md'
          )}
          onBlur={() => setIsEditingTitle(false)}
          onClick={() => setIsEditingTitle(true)}
          readOnly={!isEditingTitle}
        />
        <div className="relative flex gap-2">
          <div className="flex gap-2 pr-2 border-r-2 border-gray-200">
            <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 h-9 hover:bg-slate-200">
              <FunnelIcon className="w-7 h-7" />
              <span>Filter tasks</span>
            </button>
            <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 h-9 hover:bg-slate-200">
              <UserPlusIcon className="w-7 h-7" />
              <span>Members</span>
            </button>
          </div>
          <ProjectMenu
            description={projectDescription ?? ''}
            onDelete={onDelete}
            setDescription={setProjectDescription}
          />
        </div>
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
              className="px-3 py-1 text-white bg-green-400 rounded-md w-fit hover:bg-green-500"
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
