import { Fragment, useEffect, useState } from 'react';
import { Popover } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Checkbox } from '@mantine/core';
import classNames from 'classnames';
import { DatePicker, DatePickerInput, DatesRangeValue, DateValue } from '@mantine/dates';
import * as _ from 'lodash-es';

import { Dates, SetDatePopoverProps } from '../Task.types';

const SetDatePopover = ({ customButton, dates, setDates }: SetDatePopoverProps) => {
  const [startDate, setStartDate] = useState<Date | null>(dates[0]);
  const [dueDate, setDueDate] = useState<Date | null>(dates[1]);

  const [taskDates, setTaskDates] = useState<Dates>(dates);

  useEffect(() => {
    setStartDate(dates[0]);
    setDueDate(dates[1]);
    setStartDateEnabled(!!dates[0]);
    setDueDateEnabled(!!dates[1]);
    setTaskDates(dates);
  }, [dates]);

  const [startDateEnabled, setStartDateEnabled] = useState(!!dates[0]);
  const [dueDateEnabled, setDueDateEnabled] = useState(!!dates[1]);

  const handleDateChange = (value: DatesRangeValue | DateValue) => {
    let start: DateValue | null = null;
    let due: DateValue | null = null;

    if (startDateEnabled && dueDateEnabled) {
      [start, due] = value as DatesRangeValue;
    } else if (startDateEnabled) {
      start = value as DateValue;
    } else {
      due = value as DateValue;
      setDueDateEnabled(true);
    }

    setStartDate(start);
    setDueDate(due);
    setTaskDates([start, due]);
  };

  const handleStartDateCheck = (value: boolean) => {
    setTaskDates([value ? startDate : null, dueDateEnabled ? dueDate : null]);
    setStartDateEnabled(value);
  };

  const handleDueDateCheck = (value: boolean) => {
    setTaskDates([startDateEnabled ? startDate : null, value ? dueDate : null]);
    setDueDateEnabled(value);
  };

  const handleRemove = () => {
    setTaskDates([null, null]);
    setStartDate(null);
    setDueDate(null);
    setStartDateEnabled(false);
    setDueDateEnabled(false);
    setDates([null, null]);
  };

  const handleSave = () => {
    if (_.isEqual(dates, taskDates)) return;

    setDates(taskDates);
  };

  return (
    <Popover className="relative">
      <Popover.Button as={Fragment}>{customButton}</Popover.Button>
      <Popover.Panel className="absolute z-10 flex flex-col p-2 bg-white rounded-md shadow-md -left-1 -top-56 w-fit ">
        {({ close }) => (
          <>
            <div className="pb-2 border-b-[1px] border-slate-300 ">
              <span>Dates</span>
              <Popover.Button className="absolute top-0 right-0 p-2 rounded-full w-fit focus:outline-none">
                <XMarkIcon className="h-5" />
              </Popover.Button>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 mt-2">
              <DatePicker
                type={startDateEnabled && dueDateEnabled ? 'range' : 'default'}
                value={taskDates}
                onChange={(value) => handleDateChange(value)}
                allowSingleDateInRange
              />
              <div className="flex flex-col items-start justify-center w-full gap-4 px-2 mt-4">
                <div className="flex flex-col items-start">
                  <span
                    className={classNames(
                      { 'text-blue-500': startDateEnabled, 'text-slate-800': !startDateEnabled },
                      'text-sm'
                    )}
                  >
                    Start date
                  </span>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={startDateEnabled}
                      onChange={(event) => handleStartDateCheck(event.currentTarget.checked)}
                    />
                    <DatePickerInput placeholder="Start date" value={startDate} readOnly />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span
                    className={classNames(
                      { 'text-blue-500': dueDateEnabled, 'text-slate-800': !dueDateEnabled },
                      'text-sm'
                    )}
                  >
                    Due date
                  </span>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={dueDateEnabled}
                      onChange={(event) => handleDueDateCheck(event.currentTarget.checked)}
                    />
                    <DatePickerInput placeholder="Due date" value={dueDate} readOnly />
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full gap-1 mt-4">
                <button
                  onClick={() => {
                    handleSave();
                    close();
                  }}
                  className="w-full py-1 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    handleRemove();
                    close();
                  }}
                  className="w-full py-1 rounded-md bg-slate-100 hover:bg-slate-200"
                >
                  Remove
                </button>
              </div>
            </div>
          </>
        )}
      </Popover.Panel>
    </Popover>
  );
};

export default SetDatePopover;
