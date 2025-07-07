import React from 'react';
import {Link, useLocation} from 'react-router-dom';

function Layout({children}: {children: React.ReactNode}) {
  
  const location = useLocation();

  return (
    <>
    <header>
        <nav>
            <Link className={location.pathname === "/notes" || location.pathname === "/notes/" ? "current-page" : ""} to='/notes'>Home</Link>
            <Link className={location.pathname.includes("/new-note") ? "current-page" : ""} to='/notes/new-note'>New Note</Link>
        </nav>
    </header>
    {children}
    </>
  )
}

export default Layout