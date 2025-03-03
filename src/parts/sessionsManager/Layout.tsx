import React from 'react';
import {Link, useLocation} from 'react-router-dom';


function Layout({children}: {children: React.ReactNode}) {

  const location = useLocation();

  return (
    <>
    <header>    
      <nav>
        <Link className={location.pathname === "/sessions-manager" || location.pathname === "/sessions-manager/" ? "current-page" : "" } to="/sessions-manager">Home</Link>
        <Link className={location.pathname.includes("/completed") ? "current-page" : "" } to="/sessions-manager/completed">Completed</Link>
        <Link className={location.pathname.includes("/in-progress") ? "current-page" : "" } to="/sessions-manager/in-progress">In Progress</Link>
        <Link className={location.pathname.includes("/new-project") ? "current-page" : "" } to="/sessions-manager/new-project">New Project</Link>
      </nav>
    </header>
    {children}
    </>
  )
}

export default Layout;