import loader from '../../assets/Loader.svg';

interface LoaderProps {
  className?: string;
}

const Loader = ({ className }: LoaderProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img src={loader} alt="Loader"/>
    </div>
  );
};

export default Loader;
