import React, {useEffect, useContext} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PopupContext } from './context/PopupContext';

import ContentPopup from './components/ContentPopup';
import Settings from './components/Settings';
import Profile from './components/Profile';


function Layout({children}: {children: React.ReactNode}) {
  const location = useLocation();
  const navigator = useNavigate();

  const {setShowPopup, setPopup, showPopup, popup} = useContext(PopupContext)

  useEffect(() => {

    const handleNav = (label: 'profile' | 'settings') => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        navigator('/central/'+window.location.hash.slice(1))
      } else {
        setShowPopup(true);
        setPopup(label);
      }
    }

    switch (window.location.hash) {
      case '#profile':
        handleNav('profile');
        break;

      case '#settings':
        handleNav('settings');
        break;

      default:
        break;
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCheckNav(e: React.MouseEvent<HTMLElement>) {
    if (!window.matchMedia('(max-width: 768px)').matches) {
      e.preventDefault();

      
      switch ((e.target as HTMLElement).id) {
        case 'profile':
          window.location.hash = 'profile';
          setPopup('profile');
          setShowPopup(true);
          break;

        case 'settings':
          window.location.hash = 'settings';
          setPopup('settings');
          setShowPopup(true);
          break;
      
        case 'stats':
          break;
        
        case 'current-goal':
          break;

        default:
          break;
      }

    }
  }


  return (
    <>
    <header>
      <div className="nav-1">
        <Link id='profile' onClick={handleCheckNav} to={'/central/profile'}>
          <span id='profile'>Profile</span>
        </Link>
        <Link id='settings' onClick={handleCheckNav} to={'/central/settings'}>
          <span id='settings'>Settings</span>
        </Link>
        <Link id='stats' onClick={handleCheckNav} to={'/central/stats'}>
          <span id='stats'>Stats</span>
        </Link>
        <Link id='current-goal' onClick={handleCheckNav} to={'/central/current-goal'}>
          <span>Current Goal</span>
        </Link>
      </div>
      <nav className="nav-2">
        <Link className={location.pathname === '/central/' || location.pathname === '/central' ? 'current-page' : ''} to={'/central/'}>
          <span>Home</span>
        </Link>
        <Link className={location.pathname.includes('/create-new-list') ? 'current-page' : ''} to={'/central/create-new-list'}>
          <span>Create New List</span>
        </Link>
        <Link className={location.pathname.includes('/all-lists') ? 'current-page' : ''} to={'/central/all-lists'}>
          <span>All Lists</span>
        </Link>
      </nav>
    </header>
    {children}
    {showPopup && (
        <ContentPopup>
            {popup === 'profile' && <Profile />}
            {popup === 'settings' && <Settings />}
        </ContentPopup>
    )}
    </>
  )
}

export default Layout