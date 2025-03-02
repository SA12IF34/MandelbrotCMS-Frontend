import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Layout({children}: {children: React.ReactNode}) {
  const location = useLocation();

  return (
    <>
    <header>
        <nav>
            <Link className={(location.pathname === '/learning-tracker' || location.pathname === '/learning-tracker/') ? 'current-page' : ''} to={'/learning-tracker/'}>Home</Link>
            <Link className={location.pathname.includes('learning-tracker/add-new') ? 'current-page' : ''} to={'/learning-tracker/add-new'}>Add New</Link>
        </nav>
    </header>
    {children}
    </>
  )
}

export default Layout