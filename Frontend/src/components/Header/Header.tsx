import { Link } from 'react-router-dom';

import Logo from '../Logo';
import ProfileMenu from '../ProfileMenu';
// import Notifications from './Notifications';

const Header = () => {
  return (
    <nav className="relative flex items-center justify-between p-1 px-4 bg-transparent border-b-[1px] h-14 border-slate-200">
      <Link
        to={'/dashboard'}
        className="flex items-center justify-center px-3 py-1 bg-white rounded-md cursor-pointer hover:bg-slate-100"
      >
        <Logo />
      </Link>

      <div className="flex items-center">
        {/* <Notifications /> */}
        <ProfileMenu />
      </div>
    </nav>
  );
};

export default Header;
