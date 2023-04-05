import loader from '../assets/Loader.svg';

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <img src={loader} />
    </div>
  );
};

export default Loader;
