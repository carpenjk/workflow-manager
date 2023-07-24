import { HTMLProps, useState } from 'react';
import NavItem from './NavItem';
import {HomeIcon, SquaresPlusIcon, TableCellsIcon, UserIcon, ArrowsRightLeftIcon} from '@heroicons/react/24/outline'
import { twMerge } from 'tailwind-merge';
import { useGetUserDetailsQuery } from 'app/services/auth';
import NavText from './Navtext';
import { ToastContainer } from 'react-toastify';

type Props = {
  className?: HTMLProps<HTMLElement>["className"];
}

const Navbar = ({className}: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {data: user} = useGetUserDetailsQuery();

  return (
    <>
      <div className={twMerge("fixed bottom-0 sm:relative w-screen sm:h-screen sm:pl-4 sm:pr-8 sm:flex sm:flex-col sm:w-auto bg-gradient-to-r from-sky-800/20 from-10% via-sky-900/20 via-30% to-slate-900", className)}>
        <nav className='relative w-full'>
          <ul className="flex justify-between w-full sm:space-y-6 sm:flex-col ">
            <NavItem collapsed={isCollapsed} to="/" ><HomeIcon className='flex-none w-5 h-5 '/><NavText>Dashboard</NavText></NavItem>
            <NavItem collapsed={isCollapsed} to="/workflows" ><SquaresPlusIcon className='flex-none w-5 h-5'/><span className='flex space-x-1.5'><NavText>Create</NavText><NavText className='hidden sm:flex'>Workflow</NavText></span></NavItem>
            <NavItem collapsed={isCollapsed} to="/manage" ><TableCellsIcon className='flex-none w-5 h-5'/><span className='flex space-x-1.5'><NavText>Manage</NavText><NavText className='hidden sm:flex'> Workflows</NavText></span></NavItem>
            {!user?.email && 
              <NavItem collapsed={isCollapsed} to="/login" ><UserIcon className='flex-none w-5 h-5'/><NavText>Login</NavText></NavItem>
            }
            {user?.email && 
            <NavItem collapsed={isCollapsed} to="/logout" ><UserIcon className='flex-none w-5 h-5'/><NavText>Logout</NavText></NavItem>
            }
          </ul>
          <button onClick={()=> setIsCollapsed((prev)=> !prev)} className='absolute hidden p-1 border rounded-md sm:flex text-slate-200 slate-400 w-7 h-7 -right-11 top-3 hover:animate-bounce-once border-slate-600'><ArrowsRightLeftIcon/></button>
        </nav>
      </div> 
      <ToastContainer
      className="content-centered"
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  </>
  );
}
 
export default Navbar;