import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Profile from './components/Profile';
import Settings from './components/Settings';
import ContentPopup from './components/ContentPopup';

function Layout({children}: {children: React.ReactNode}) {
  const location = useLocation();
  const navigator = useNavigate();

  useEffect(() => {

    const handleNav = (Container: React.ComponentType) => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        navigator('/central/'+window.location.hash.slice(1))
      } else {
        handleOpenPopup(Container);
      }
    }

    switch (window.location.hash) {
      case '#profile':
        handleNav(Profile);
        break;

      case '#settings':
        handleNav(Settings);
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
          handleOpenPopup(Profile);
          break;

        case 'settings':
          window.location.hash = 'settings';
          handleOpenPopup(Settings);
          break;
      
        case 'stats':
          break;

        default:
          break;
      }

    }
  }

  function handleOpenPopup(Container: React.ComponentType) {
    if (document.getElementById('content-popup')) {
      document.getElementById('content-popup')?.remove();
    }

    const mainContainer = document.querySelector('.main-container') as HTMLElement;
    const container = document.createElement('div');
    container.id = 'content-popup';
    
    ReactDOM.createRoot(container).render(
      <ContentPopup>
        <Container />
      </ContentPopup>
    );

    mainContainer.appendChild(container);
  }

  return (
    <>
    <header>
      <div className="nav-1">
        <Link id='profile' onClick={handleCheckNav} to={'/central/profile'}>
          <span id='profile'>Profile</span>
        </Link>
        {/* <Link id='settings' onClick={handleCheckNav} to={'/settings'}>
          <span id='settings'>Settings</span>
        </Link> */}
        <Link id='stats' onClick={handleCheckNav} to={'/central/stats'}>
          <span id='stats'>Stats</span>
        </Link>
        <Link id='#' onClick={handleCheckNav} to={'/central/#'}>
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
    </>
  )
}

export default Layout