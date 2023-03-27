import { useState } from 'react';

import { TaskProps } from './Task.types';

const Task = ({ title, onRemove }: TaskProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState(title);

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleSaveClick() {
    setIsEditing(false);
  }

  function handleTaskTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTaskTitle(e.target.value);
  }

  return (
    <div className="p-2 bg-white">
      {isEditing ? (
        <>
          <input type="text" value={taskTitle} onChange={handleTaskTitleChange} />
          <button onClick={handleSaveClick}>Save</button>
        </>
      ) : (
        <>
          <span>{taskTitle}</span>
          {/* <button onClick={handleEditClick}>Edit</button>
          <button onClick={onRemove}>Remove</button> */}
        </>
      )}
    </div>
  );
};

export default Task;
