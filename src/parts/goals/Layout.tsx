import React from 'react';
import {Link, useLocation} from 'react-router-dom';

function Layout({children}: {children: React.ReactNode}) {

  const location = useLocation();

  return (
    <>
    <header>
        <nav>
            <Link className={location.pathname === '/goals' || location.pathname === '/goals/' ? 'current-page' : ''} to={'/goals/'}>
            Home
            </Link>
            <Link className={location.pathname.includes('create-goal') ? 'current-page' : ''} to={'/goals/create-goal/'}>
            Create Goal
            </Link>
        </nav>
    </header>
    {children}
    </>

  )
}

export default Layout