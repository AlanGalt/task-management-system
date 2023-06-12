import Loader from '../Loader';
import { ProfilePictureProps } from './ProfilePicture.types';

const ProfilePicture = ({ className, src }: ProfilePictureProps) => {
  if (!src) return <Loader className="w-11 h-11" />;

  return <img src={src} alt="Profile" className={`${className} object-cover rounded-full`} />;
};

export default ProfilePicture;
