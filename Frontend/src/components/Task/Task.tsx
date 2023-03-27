import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { TaskProps } from './Task.types';

const Task = ({ title, onRemove }: TaskProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState(title);

  return (
    <div className="flex justify-between p-2 bg-white rounded-md group">
      <span>{taskTitle}</span>
      <div className="flex">
        <div className="invisible p-1 rounded-md hover:cursor-pointer group-hover:visible hover:bg-base-200">
          <PencilIcon className="h-5" />
        </div>
        <button
          onClick={onRemove}
          className="invisible p-1 rounded-md hover:cursor-pointer group-hover:visible hover:bg-base-200"
        >
          <TrashIcon className="h-5" />
        </button>
      </div>
    </div>
  );
};

export default Task;
