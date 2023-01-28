import { BriefcaseIcon } from '@heroicons/react/24/outline';

const Logo = () => {
  return (
    <div className="flex items-center">
      <BriefcaseIcon className="h-8 mr-2" />
      <div className="text-lg font-bold">Project Master</div>
    </div>
  );
};

export default Logo;
