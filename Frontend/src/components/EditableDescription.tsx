import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useState } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';

interface EditableDescriptionProps {
  title: string;
  description: string;
  hasPermission: boolean;
  setDescription: (description: string) => void;
  onBlur: () => void;
}

const EditableDescription = ({
  title,
  description,
  hasPermission,
  setDescription,
  onBlur,
}: EditableDescriptionProps) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const handeDescriptionBlur = () => {
    setIsEditingDescription(false);
    onBlur();
  };

  return (
    <div className="flex flex-col items-start w-full gap-2 border-slate-200">
      {(hasPermission || description) && (
        <div className="flex items-center gap-2">
          <Bars3BottomLeftIcon className="h-5" />
          <span className="font-medium">Description</span>
        </div>
      )}
      {!isEditingDescription && description && (
        <p
          onClick={() => hasPermission && setIsEditingDescription(true)}
          className={classNames(
            { 'cursor-pointer': hasPermission },
            'font-light text-left whitespace-pre-wrap'
          )}
        >
          {description}
        </p>
      )}
      {hasPermission && (isEditingDescription || !description) && (
        <ReactTextareaAutosize
          value={description}
          placeholder={`Describe what this ${title.toLowerCase()} is about...`}
          onChange={(e) => setDescription(e.target.value)}
          className={classNames(
            {
              'cursor-pointer hover:bg-slate-200 bg-slate-100': !isEditingDescription,
            },
            'w-full px-3 py-2 border border-gray-300 rounded-md resize-none font-light h-10 overflow-hidden'
          )}
          readOnly={!isEditingDescription}
          onClick={() => setIsEditingDescription(true)}
          onBlur={handeDescriptionBlur}
          autoFocus
        />
      )}
    </div>
  );
};

export default EditableDescription;
