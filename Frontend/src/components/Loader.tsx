import loader from '../assets/Loader.svg';

interface LoaderProps {
  className?: string;
}

const Loader = ({ className }: LoaderProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img src={loader} />
    </div>
  );
};

export default Loader;
