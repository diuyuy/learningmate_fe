import { ROUTE_PATHS } from '@/constants/routepaths';
import { Link } from 'react-router';
import HeaderDropDown from './HeaderDropdown';

export default function Header() {
  return (
    <header className='flex justify-between bg-primary text-white p-2 mb-2'>
      <div className='flex-1'>
        <div className='flex gap-4'>
          <Link to={ROUTE_PATHS.LANDING}>Landing</Link>
          <Link to={ROUTE_PATHS.LEARNING}>Learning</Link>
          <Link to={ROUTE_PATHS.ARTICLE_DETAIL(1)}>Article</Link>
          <Link to={ROUTE_PATHS.LOGIN}>Login</Link>
          <Link to={ROUTE_PATHS.SIGNUP}>Signup</Link>
          <Link to={ROUTE_PATHS.MY}>My</Link>
        </div>
      </div>
      <Link to={ROUTE_PATHS.MAIN}>LearningMate</Link>
      <div className='flex-1 flex justify-end'>
        <HeaderDropDown />
      </div>
    </header>
  );
}
