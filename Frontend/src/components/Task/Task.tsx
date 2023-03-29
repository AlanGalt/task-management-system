import { CheckIcon, PencilIcon } from '@heroicons/react/24/outline';
import React, { useState, useRef } from 'react';

import { TaskProps } from './Task.types';
import TaskDialog from './TaskDialog';

const Task = ({ title, onDelete }: TaskProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState(title);
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState(title);

  const [taskDescription, setTaskDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const saveButtonRef = useRef<HTMLButtonElement | null>(null);
  const editButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTaskTitle(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (saveButtonRef.current?.contains(e.relatedTarget)) return;

    setIsEditing(false);
    setUpdatedTaskTitle(taskTitle);
  };

  const handleSave = () => {
    if (!updatedTaskTitle) return;
    setTaskTitle(updatedTaskTitle);
    setIsEditing(false);
  };

  return isEditing ? (
    <div className="flex items-center justify-between gap-2">
      <input
        value={updatedTaskTitle}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full p-2 rounded-md h-11"
        autoFocus
      />
      <button
        ref={saveButtonRef}
        className="p-1 hover:text-slate-500"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleSave}
      >
        <CheckIcon className="h-5" />
      </button>
    </div>
  ) : (
    <>
      <div
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center justify-between p-2 bg-white rounded-md cursor-pointer group"
      >
        <span>{taskTitle}</span>
        <div className="flex">
          <button
            className="invisible p-1 rounded-md hover:cursor-pointer group-hover:visible hover:bg-base-200"
            onClick={handleEdit}
            ref={editButtonRef}
          >
            <PencilIcon className="h-5" />
          </button>
        </div>
      </div>
      <TaskDialog
        isOpen={isDialogOpen}
        description={taskDescription}
        setDescription={setTaskDescription}
        onClose={() => setIsDialogOpen(false)}
        title={taskTitle}
        setTitle={setTaskTitle}
        onDelete={onDelete}
      />
    </>
  );
};

export default Task;
