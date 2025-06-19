import React, {useContext} from 'react';
import { ThemeContext } from './context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { MdLightMode, MdDarkMode } from "react-icons/md";

function Layout({children}: {children: React.ReactNode}) {
  const location = useLocation();

  const {theme, handleSetTheme} = useContext(ThemeContext);

  
  return (
    <>
    <header>
      <nav>
        <Link className={location.pathname === '/entertainment/' || location.pathname === '/entertainment' ? 'current-page' : ''} to={'/entertainment/'}>Home</Link>
        <Link className={location.pathname.includes('/add-material') ? 'current-page' : ''} to={'/entertainment/add-material/'}>Add New</Link>
        <Link className={location.pathname.includes('/special') ? 'current-page' : ''} to={'/entertainment/special/'}>Special</Link>
        <Link className={location.pathname.includes('/search') ? 'current-page' : ''} to={'/entertainment/search'}>Search</Link>
        <button>
          {theme === 'light' ? <MdLightMode onClick={() => {handleSetTheme && handleSetTheme('dark')}} /> : <MdDarkMode onClick={() => {handleSetTheme && handleSetTheme('light')}} />}
        </button>
      </nav>
      
    </header>
    {children}
    </>
  )
}

export default Layout