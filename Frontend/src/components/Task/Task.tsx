import { CheckIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Badge } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import classNames from 'classnames';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import ProfilePicture from '../ProfilePicture/ProfilePicture';
import MembersContext from '../../contexts/MembersContext';
import { Permission } from '../Projects/Project/Project.types';
import { Dates, TaskProps } from './Task.types';
import TaskDialog from './TaskDialog';
import LabelsContext from '../../contexts/LabelsContext';

const Task = ({ taskData, listTitle, permit, index, onDelete, onUpdate }: TaskProps) => {
  const { id, title, description, assignedMembersUid, startDate, dueDate, completed, labelIds } =
    taskData;

  const labels = useContext(LabelsContext);
  const members = useContext(MembersContext);

  const assignedMembers = members?.filter((m) => assignedMembersUid.includes(m.uid));
  const taskLabels = labels?.filter((label) => labelIds.includes(label.id));

  const startDateObj = startDate ? new Date(startDate.toDate()) : null;
  const dueDateObj = dueDate ? new Date(dueDate.toDate()) : null;

  const dates = [startDateObj, dueDateObj] as Dates;

  const shouldRenderSubsection =
    !!assignedMembers?.length || !!dates[0] || !!dates[1] || !!taskLabels?.length;

  const [isEditing, setIsEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState(title);
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState(title);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (title === taskTitle) return;

    setTaskTitle(title);
  }, [title]);

  const saveButtonRef = useRef<HTMLButtonElement | null>(null);
  const editButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (saveButtonRef.current?.contains(e.relatedTarget)) return;

    setIsEditing(false);
    setUpdatedTaskTitle(taskTitle);
  };

  const handleSave = () => {
    if (!updatedTaskTitle) return;

    onUpdate({ title: updatedTaskTitle });
    setTaskTitle(updatedTaskTitle);
    setIsEditing(false);
  };

  const getDateColor = () => {
    if (completed) {
      return 'green';
    }

    if (!dates[1]) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dates[1].getTime() === today.getTime()) {
      return 'orange';
    }

    if (dates[1].getTime() === tomorrow.getTime()) {
      return 'yellow';
    }

    if (dates[1] < today) {
      return 'red';
    }
  };

  return isEditing ? (
    <div className="flex items-center justify-between gap-2 mb-2 ">
      <input
        value={updatedTaskTitle}
        onChange={(e) => setUpdatedTaskTitle(e.target.value)}
        onBlur={handleBlur}
        className="w-full h-10 px-2 py-1 rounded-md"
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        autoFocus
        data-testid="task-input"
      />
      <button
        ref={saveButtonRef}
        className="p-1 hover:text-slate-500"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleSave}
        data-testid="task-saveButton"
      >
        <CheckIcon className="h-5" />
      </button>
    </div>
  ) : (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <div
            {...(permit[Permission.EditTasks] && provided.draggableProps)}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={() => setIsDialogOpen(true)}
            className="relative flex flex-col items-center justify-between gap-3 mb-2 p-2 bg-white rounded-md !cursor-pointer group shadow-sm shadow-slate-400 hover:bg-slate-50"
          >
            <div className="flex items-center justify-between w-full">
              <span>{taskTitle}</span>
              {permit[Permission.EditTasks] && (
                <div>
                  <button
                    className="absolute invisible p-1 bg-transparent rounded-md top-1 right-1 group-hover:visible hover:bg-slate-200"
                    onClick={handleEdit}
                    ref={editButtonRef}
                    data-testid="task-editButton"
                  >
                    <PencilIcon className="h-5" />
                  </button>
                </div>
              )}
            </div>
            {shouldRenderSubsection && (
              <div className="flex flex-wrap items-center justify-between w-full gap-3">
                {!!assignedMembers?.length && (
                  <div className="flex flex-wrap items-center gap-1" data-testid="task-members">
                    {assignedMembers?.map((member) => (
                      <ProfilePicture key={member.uid} src={member.photoURL} className="h-7" />
                    ))}
                  </div>
                )}
                {!!taskLabels?.length && (
                  <div className="flex flex-wrap gap-1">
                    {taskLabels?.map((label) => (
                      <div
                      key={label.id}  
                      className={`${label.color} min-w-[2.5rem] max-w-full h-6 flex items-center rounded-md px-1 py-1`}
                        data-testid="task-labels"
                      >
                        <span className="font-extrabold text-white truncate">{label.title}</span>
                      </div>
                    ))}
                  </div>
                )}
                {(dates[0] || dates[1]) && (
                  <div className="flex items-center justify-center" data-testid="task-dates">
                    <Badge
                      variant="filled"
                      radius="sm"
                      color={getDateColor()}
                      className={classNames({ 'bg-yellow-400': getDateColor() === 'yellow' })}
                      size="lg"
                    >
                      <DatePickerInput
                        type={dates[0] && dates[1] ? 'range' : 'default'}
                        valueFormat={`MMM D${
                          dates[0]?.getFullYear() !== dates[1]?.getFullYear() ? ', YYYY' : ''
                        }`}
                        allowSingleDateInRange
                        value={dates.filter((d) => d) as Dates}
                        readOnly
                        className="white-text-date no-border-date"
                      />
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Draggable>
      {/* TODO: make props more consise everywhere in the project */}
      <TaskDialog
        isOpen={isDialogOpen}
        description={description ?? ''}
        title={taskTitle}
        listTitle={listTitle}
        permit={permit}
        taskLabels={taskLabels ?? []}
        assignedMembersUid={assignedMembersUid}
        dates={dates}
        completed={completed}
        labelIds={labelIds}
        setDescription={(newDescription) => onUpdate({ description: newDescription })}
        setTitle={(newTitle) => onUpdate({ title: newTitle })}
        onClose={() => setIsDialogOpen(false)}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </>
  );
};

export default Task;
