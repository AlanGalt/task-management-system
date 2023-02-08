import LocalPicture from '../assets/ProfilePicture.jpg';

interface ProfilePictureProps {
  className: string;
}

const ProfilePicture = ({ className }: ProfilePictureProps) => {
  return (
    <img src={LocalPicture} alt="Profile" className={`${className} object-cover rounded-full`} />
  );
};

export default ProfilePicture;