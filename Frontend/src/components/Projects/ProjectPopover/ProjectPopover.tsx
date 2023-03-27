import { Popover } from '@headlessui/react';

const ProjectPopover = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event);
  };

  return (
    <Popover>
      <Popover.Button className="h-32 px-2 py-1 text-center rounded-md outline-none hover:cursor-pointer w-52 bg-base-400 text-base-content">
        Add new project
      </Popover.Button>
      <Popover.Panel className="absolute z-10 -translate-x-1/2 -translate-y-1/2 border-2 border-base-300 top-1/2 left-1/2">
        <form className="flex flex-col p-4 space-y-2" onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="title" className="font-medium">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="p-2 border border-gray-400 rounded-md"
            required
          />
          <label htmlFor="description" className="font-medium">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="p-2 border border-gray-400 rounded-md resize-none"
          ></textarea>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="p-2 text-white bg-green-400 rounded-md hover:bg-green-500 border-base-content"
            >
              Create
            </button>
          </div>
        </form>
      </Popover.Panel>
    </Popover>
  );
};

export default ProjectPopover;
