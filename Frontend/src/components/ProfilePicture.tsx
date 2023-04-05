import localPicture from '../assets/ProfilePicture.jpg';

interface ProfilePictureProps {
  className?: string;
  src?: string;
}

const ProfilePicture = ({ className, src }: ProfilePictureProps) => {
  return (
    <img
      src={src ?? localPicture}
      alt="Profile"
      className={`${className} object-cover rounded-full`}
    />
  );
};

export default ProfilePicture;
