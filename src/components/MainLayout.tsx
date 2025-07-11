import React from 'react';
import { Location, useLocation } from 'react-router-dom';
import { SlArrowRight } from "react-icons/sl";
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { handleGetSettings } from '../api';

interface partNav {
    href: string,
    name: string
}

interface styleProp {
    layout: string,
    nav: string,
    c1: string,
    c2: string,
    c3: string
}

function MainLayout({children, style}: {children: React.ReactNode, style: styleProp}) {
  const location: Location = useLocation();
  
  const {settings, setSettings} = React.useContext<AuthContextType>(AuthContext) as AuthContextType;

  const partsNavData: Array<partNav> = [
    { 
        href: '/central',
        name: 'The Central'
    },
    {
        href: '/sessions-manager',
        name: 'Sessions Manager'
    },{
        href: '/learning-tracker',
        name: 'Learning Tracker'
    },{
        href: '/entertainment',
        name: 'Entertainment'
    },{
        href: '/goals',
        name: 'Goals'
    },{
        href: '/notes',
        name: 'Notes'  
    }
  ]

  function handleToggleNav() {
    document.querySelector('.side-nav')?.classList.toggle('close');
    document.querySelector('.toggle-container')?.classList.toggle('open');
    document.querySelector('.main-layout')?.classList.toggle('side-bar-open');
  }


  React.useEffect(() => {
    if (!settings) {
        const fetchSettings = async () => {
            const data = await handleGetSettings();
            if (data) {
                setSettings && setSettings(data);
            }
        }
        fetchSettings();
    } else {
        if (settings.open_sidenav) {
            if (window.matchMedia('(min-width: 768px)').matches) {
                document.querySelector('.side-nav')?.classList.remove('close');
                (document.querySelector('.toggle-container') as HTMLElement).style.cssText = 'display: none;';
                document.querySelector('.main-layout')?.classList.add('side-bar-open');
            }
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  return (
    <div className={`main-layout ${style.layout}`}>
        <div className={`side-nav close ${style.nav}`}>
            <div className="side-nav-list">
                {partsNavData.map((part, idx) => {
                    return !location.pathname.includes(part.href) ? (<>
                        <div key={part.name} className='nav-item'>
                            <a style={{color: style.c3}} href={part.href}>
                                <span>{part.name}</span>
                            </a>
                        </div>
                        {idx < partsNavData.length-1 && <div key={`${part.name}-sep`} style={{backgroundColor: style.c2}} className='sep'></div>}
                    </>) : null
                })}
            </div>
            <div onClick={handleToggleNav} className="toggle-container">
                <SlArrowRight style={{color: style.c2}} className={'toggle-arrow'} />
                <div style={{backgroundColor: style.c2}} className={`toggle-line`}></div>
            </div>
        </div>
        <div className="main-container">
            {children}
        </div>
    </div>
  )
}

export default MainLayout