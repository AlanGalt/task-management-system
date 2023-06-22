import { Fragment, useContext, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  CalendarIcon,
  ChevronDownIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Timestamp } from 'firebase/firestore';
import { Badge, Checkbox } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

import { Dates, LabelData, TaskDialogProps } from '../Task.types';
import { Permission } from '../../Projects/Project/Project.types';
import EditableDescription from '../../EditableDescription';
import AssignPopover from './AssignPopover';
import MembersContext from '../../../contexts/MembersContext';
import ProfilePicture from '../../ProfilePicture';
import SetDatePopover from './SetDatePopover';
import LabelPopover from './LabelPopover';

export const TaskDialog = ({
  isOpen,
  title,
  description,
  listTitle,
  permit,
  assignedMembersUid,
  dates,
  completed,
  labelIds,
  taskLabels,
  setTitle,
  setDescription,
  onClose,
  onUpdate,
  onDelete,
}: TaskDialogProps) => {
  const [taskTitle, setTaskTitle] = useState(title);
  const [taskDescription, setTaskDescription] = useState(description);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const members = useContext(MembersContext);

  const assignedMembers = members?.filter((m) => assignedMembersUid.includes(m.uid));

  useEffect(() => {
    if (title === taskTitle) return;

    setTaskTitle(title);
  }, [title]);

  useEffect(() => {
    if (description === taskDescription) return;

    setTaskDescription(description);
  }, [description]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    setTitle(taskTitle);
  };

  const handleDescriptionBlur = () => {
    if (description === taskDescription) return;
    setDescription(taskDescription);
  };

  const assignToMember = (memberUid: string) => {
    const updatedAssigned = assignedMembersUid.includes(memberUid)
      ? assignedMembersUid.filter((m) => m !== memberUid)
      : [...assignedMembersUid, memberUid];

    onUpdate({ assignedMembersUid: updatedAssigned });
  };

  const setDates = (dates: Dates) => {
    const [startDate, dueDate] = dates.map((d) => (d ? Timestamp.fromDate(d) : null));
    onUpdate({ startDate: startDate, dueDate: dueDate });
  };

  const renderDateBadge = () => {
    if (completed) {
      return (
        <Badge variant="filled" color="green" radius="sm">
          completed
        </Badge>
      );
    }

    if (!dates[1]) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dates[1].getTime() === today.getTime()) {
      return (
        <Badge variant="filled" color="orange" radius="sm">
          due today
        </Badge>
      );
    }

    if (dates[1].getTime() === tomorrow.getTime()) {
      return (
        <Badge variant="filled" className="bg-yellow-400" radius="sm">
          due tomorrow
        </Badge>
      );
    }

    if (dates[1] < today) {
      return (
        <Badge variant="filled" color="red" radius="sm">
          overdue
        </Badge>
      );
    }
  };

  const renderDatePicker = () => (
    <DatePickerInput
      type={dates[0] && dates[1] ? 'range' : 'default'}
      valueFormat={`MMM D${dates[0]?.getFullYear() !== dates[1]?.getFullYear() ? ', YYYY' : ''}`}
      allowSingleDateInRange
      value={dates.filter((d) => d) as Dates}
      readOnly
      className="no-border-date"
    />
  );

  const createLabel = (labelData: LabelData) => {
    // console.log(labelData);
  };

  const toggleLabel = (labelId: string) => {
    const updatedLabels = taskLabels.some((l) => l.id === labelId)
      ? labelIds.filter((l) => l !== labelId)
      : [...labelIds, labelId];

    onUpdate({ labelIds: updatedLabels });
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4">
                <Dialog.Panel className="relative flex w-1/2 gap-6 px-8 py-6 mx-auto bg-white rounded-md text-base-content">
                  <button
                    onClick={onClose}
                    className="absolute p-2 rounded-full top-1 right-1 w-fit hover:bg-gray-200"
                  >
                    <XMarkIcon className="h-5" />
                  </button>
                  <div className="flex flex-col w-full gap-4">
                    <div className="flex flex-col items-start">
                      <input
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        className={classNames(
                          {
                            'bg-transparent cursor-pointer outline-none':
                              !isEditingTitle && permit[Permission.EditTasks],
                            'cursor-default outline-none': !permit[Permission.EditTasks],
                          },
                          'text-xl w-[calc(100%-5px)] px-2 -ml-2 font-medium rounded-md'
                        )}
                        onBlur={handleTitleBlur}
                        onClick={() => permit[Permission.EditTasks] && setIsEditingTitle(true)}
                        readOnly={!isEditingTitle || !permit[Permission.EditTasks]}
                      />
                      <span className="font-light cursor-default text-slate-600">
                        in list <strong>{listTitle}</strong>
                      </span>
                    </div>
                    <div className="flex gap-5">
                      <div className="flex flex-col w-full gap-6">
                        <div className="flex flex-wrap w-full gap-6">
                          {!!assignedMembers?.length && (
                            <div className="flex flex-col items-start justify-between gap-2 w-fit">
                              <span className="text-sm text-left text-slate-600">Assigned</span>
                              <div className="flex flex-wrap gap-1">
                                {assignedMembers.map((member) => (
                                  <ProfilePicture
                                    key={member.uid}
                                    src={member.photoURL}
                                    className="h-9"
                                  />
                                ))}
                                {permit[Permission.EditTasks] && (
                                  <AssignPopover
                                    customButton={
                                      <button className="flex items-center justify-center rounded-full h-9 w-9 bg-slate-200 hover:bg-slate-300">
                                        <PlusIcon className="h-5" />
                                      </button>
                                    }
                                    assignToMember={assignToMember}
                                    assignedMembersUid={assignedMembersUid}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                          {!!taskLabels?.length && (
                            <div className="flex flex-col justify-between gap-2">
                              <span className="text-sm text-left text-slate-600">Labels</span>
                              <div className="flex flex-wrap items-center gap-1">
                                {taskLabels.map((label) => (
                                  <div
                                    className={`${label.color} min-w-[3rem] max-w-full h-8 flex items-center rounded-md px-1 py-1`}
                                    key={label.id}
                                  >
                                    <span className="font-extrabold text-white truncate">
                                      {label.title}
                                    </span>
                                  </div>
                                ))}
                                {permit[Permission.EditTasks] && (
                                  <LabelPopover
                                    customButton={
                                      <button className="flex items-center justify-center w-12 h-8 px-1 py-1 rounded-md bg-slate-100 hover:bg-slate-200">
                                        <PlusIcon className="h-5" />
                                      </button>
                                    }
                                    toggleLabel={toggleLabel}
                                    createLabel={createLabel}
                                    labelIds={labelIds}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                          {dates.some((d) => d) && (
                            <div className="flex flex-col justify-between">
                              <span className="text-sm text-left text-slate-600">
                                {dates[0] && dates[1] && 'Dates'}
                                {dates[0] && !dates[1] && 'Start date'}
                                {!dates[0] && dates[1] && 'Due date'}
                              </span>

                              <div className="flex items-center gap-2">
                                {permit[Permission.EditTasks] && (
                                  <Checkbox
                                    checked={completed}
                                    onChange={(e) => onUpdate({ completed: e.target.checked })}
                                  />
                                )}
                                {permit[Permission.EditTasks] ? (
                                  <SetDatePopover
                                    customButton={
                                      <button className="flex items-center justify-center gap-2 px-2 rounded-md bg-slate-100 hover:bg-slate-200">
                                        {renderDatePicker()}
                                        <div className="flex">{renderDateBadge()}</div>
                                        {permit[Permission.EditTasks] && (
                                          <div>
                                            <ChevronDownIcon className="h-5" />
                                          </div>
                                        )}
                                      </button>
                                    }
                                    dates={dates}
                                    setDates={setDates}
                                  />
                                ) : (
                                  <div className="flex items-center justify-center gap-2 px-2 rounded-md bg-slate-100">
                                    {renderDatePicker()}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <EditableDescription
                          title="task"
                          description={taskDescription}
                          setDescription={setTaskDescription}
                          hasPermission={permit[Permission.EditTasks]}
                          onBlur={handleDescriptionBlur}
                        />
                      </div>
                      {permit[Permission.EditTasks] && (
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex flex-col items-center gap-2 pb-3 border-b-2 border-slate-300">
                            <AssignPopover
                              customButton={
                                <button className="flex items-center justify-start gap-2 p-2 text-left rounded-md w-36 hover:bg-blue-300 bg-slate-100 ">
                                  <div>
                                    <UserPlusIcon className="h-5" />
                                  </div>
                                  <span>Assign</span>
                                </button>
                              }
                              assignedMembersUid={assignedMembersUid}
                              assignToMember={assignToMember}
                            />
                            <SetDatePopover
                              customButton={
                                <button className="flex items-center justify-start gap-2 p-2 text-left rounded-md w-36 hover:bg-blue-300 bg-slate-100">
                                  <div>
                                    <CalendarIcon className="h-5" />
                                  </div>
                                  <span>Set dates</span>
                                </button>
                              }
                              dates={dates}
                              setDates={setDates}
                            />
                            <LabelPopover
                              customButton={
                                <button className="flex items-center justify-start gap-2 p-2 text-left rounded-md w-36 hover:bg-blue-300 bg-slate-100">
                                  <div>
                                    <TagIcon className="h-5" />
                                  </div>
                                  <span>Label</span>
                                </button>
                              }
                              labelIds={labelIds}
                              toggleLabel={toggleLabel}
                              createLabel={createLabel}
                            />
                          </div>
                          <button
                            onClick={onDelete}
                            className="flex items-center justify-start gap-2 p-2 text-white bg-red-500 rounded-md w-36 hover:bg-red-600"
                          >
                            <TrashIcon className="h-5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaskDialog;
