import { ROUTE_PATHS } from '@/constants/routepaths';
import { Link } from 'react-router';
import HeaderDropDown from './HeaderDropdown';

export default function Header() {
  return (
    <header className='flex justify-between bg-primary text-white p-2 mb-2'>
      <div className='flex-1' />
      <Link to={ROUTE_PATHS.MAIN}>LearningMate</Link>
      <div className='flex-1 flex justify-end'>
        <HeaderDropDown />
      </div>
    </header>
  );
}
