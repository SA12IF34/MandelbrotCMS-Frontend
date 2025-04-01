import {useEffect, useState, useContext} from 'react';
import {createPortal} from 'react-dom';
import { AuthContext } from '../context/AuthContext';
import type { Settings } from '../types/types';
import {FaExclamation} from 'react-icons/fa6';
import '../styles/intro.css';

// Images
import mandelbrotSet from '../assets/images/MandelbrotSet.png'

import Central from '../assets/images/parts/Central.png';
import SessionsManager from '../assets/images/parts/SessionsManager.png';
import LearningTracker from '../assets/images/parts/LearningTracker.png';
import Entertainment from '../assets/images/parts/Entertainment.png';
import Goals from '../assets/images/parts/Goals.png';

import CentralTablet from '../assets/images/parts/tablet/Central.png';
import SessionsManagerTablet from '../assets/images/parts/tablet/SessionsManager.png';
import LearningTrackerTablet from '../assets/images/parts/tablet/LearningTracker.png';
import EntertainmentTablet from '../assets/images/parts/tablet/Entertainment.png';
import GoalsTablet from '../assets/images/parts/tablet/Goals.png';

import CentralMobile from '../assets/images/parts/mobile/Central.png';
import SessionsManagerMobile from '../assets/images/parts/mobile/SessionsManager.png';
import LearningTrackerMobile from '../assets/images/parts/mobile/LearningTracker.png';
import EntertainmentMobile from '../assets/images/parts/mobile/Entertainment.png';
import GoalsMobile from '../assets/images/parts/mobile/Goals.png';


// Audio
import domainExpansion from '../assets/audio/domain-expansion-sukuna.mp3';
import audio from '../assets/audio/audio.mp3';


import {createApi} from '../api';
import { AxiosError } from 'axios';

import PartDetails from '../components/PartDetails';

function Intro() {

  const [screen, setScreen] = useState<'desk' | 'tab' | 'mob'>('desk');
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [showPartDetails, setShowPartDetails] = useState<boolean>(false);
  const [partName, setPartName] = useState<string>();
  const [partDescription, setPartDescription] = useState<string>();

  const {settings, setSettings} = useContext(AuthContext) as {settings: Settings, setSettings: (settings: Settings) => void};


  const entertainmentDescription = `
  The part focused on entertainment which you can use to add any kind of entertainment materials automatically or manually,
  organize the materials, and filter them with a very advanced search system. 
  Also you can specify the materials which are special to you and they will have their own page.
  `;
  const learningTrackerDescription = `
  The part and system that you use to track and organize your learning in an easy way, 
  you add courses by just entering their url whether it was a youtube or coursera url, 
  and determine the state of the course if you are currently taking it, already have taken it, or will take it. 
  `;
  const centralDescription = `
  The core system which you use to manage your life on daily bases in regards of your projects, learning, achieving goals and rewarding yourself.
  `;
  const sessionsManagerDescription = `
  The part which is responsible for helping you whether you are studying, working or engaging in focused activities 
  by allowing you to define projects that represent what you do and break it down into partitions so you can keep track of it.
  `;
  const goalsDescription = `
  The system that enable you to combine the features of all other parts to construct your goals, and track them in very easy, aggregative and enthusiastic way.
  `;

  useEffect(() => {
    const parts = document.querySelectorAll('.part') as NodeListOf<HTMLDivElement>;
    parts.forEach((part: Element) => {
        part.addEventListener('mouseover', () => {
            part.classList.add('hover');
        });

        part.addEventListener('mouseout', () => {
            part.classList.remove('hover');
        });

        part.addEventListener('click', () => {
            
            if (settings && settings.intro_parts_nav) {
                location.assign(`/${part.id}`);
            }

            part.classList.add('selected');
           
            switch (part.id) {
                case 'central':
                    setPartName('Central');
                    setPartDescription(centralDescription);
                    break;
                case 'sessions-manager':
                    setPartName('Sessions Manager');
                    setPartDescription(sessionsManagerDescription);
                    break;
                case 'learning-tracker':
                    setPartName('Learning Tracker');
                    setPartDescription(learningTrackerDescription);
                    break;
                case 'entertainment':
                    setPartName('Entertainment');
                    setPartDescription(entertainmentDescription);
                    break;
                case 'goals':
                    setPartName('Goals');
                    setPartDescription(goalsDescription);
                    break;
                default:
                    break;
            }
            
            
            

            setShowPartDetails(true);

        })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const handleCheckAuth = async () => {
    try {
      const response = await createApi(import.meta.env.VITE_API_BASE_URL).get('authentication/apis/check-auth/');
      
      if (response.status === 200) {
        setAuthenticated(true);
        handleGetSettings();
      }

    } catch(error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 500) {
                console.error(error);
            }
        }
        setAuthenticated(false);
        console.log(error);
    }
  }

  const handleGetSettings = async () => {
      try {
          if (!localStorage.getItem('settings')) {
              const response = await createApi(import.meta.env.VITE_API_BASE_URL).get('authentication/apis/settings/');
              if (response.status === 200) {
                  const data = await response.data
                  setSettings(data as Settings);
                  localStorage.setItem('settings', JSON.stringify(data));
                  data.redirect_home && location.assign('/central');
              }
          } else {
              const data = JSON.parse(localStorage.getItem('settings') as string) as Settings;
              setSettings(data);
              data.redirect_home && location.assign('/central');

          }

      } catch(error) {
          if (error instanceof AxiosError) {
              if (error.response?.status === 500) {
                  console.error(error);
              }
          }
          console.log(error);
      }
  }


  const startSecondStage = () => {
    const page = document.querySelector('.intro-page') as HTMLDivElement;
    // (page.querySelector('audio.two') as HTMLAudioElement).play();
    (page.querySelector('.container') as HTMLElement).remove();
    (page.querySelector('button.start') as HTMLElement).remove();
    
    const newContainer = document.createElement('div');
    newContainer.classList.add('new-container');

    const title = document.createElement('h1');
    title.textContent = 'MandelbrotCMS';

    newContainer.append(title);

    (page.querySelector('.domain-container') as HTMLElement).before(newContainer);
    
    const lastTime = setTimeout(() => {
        (page.querySelector('.action-btns') as HTMLElement).classList.remove('hide');
        clearTimeout(lastTime);
    }, 3800)
  
  }



  const handleShowTip = () => {
    let action = 'Click';
    if (window.matchMedia('(max-width: 912px;)').matches) {
        action = 'Tap';
    }

    alert(`${action} on part to view it's details`);
  }

  useEffect(() => {
    handleCheckAuth();
    const page = document.querySelector('.intro-page') as HTMLDivElement;
    const container = page.querySelector('.container') as HTMLDivElement;
    const pepe = page.querySelectorAll('.container p') as NodeListOf<HTMLParagraphElement>;
    const btn = page.querySelector('button.start') as HTMLButtonElement;
    const domain = page.querySelector('.domain-container') as HTMLDivElement;
    const partsContainer = page.querySelector('.parts-container') as HTMLDivElement;
    const parts = page.querySelectorAll('.part') as NodeListOf<HTMLDivElement>;

    let screenRatio = 1.6;
    
    if (window.matchMedia('(max-width: 545px)').matches) {
        setScreen('mob');
        screenRatio = 0.45;
    } else if (window.matchMedia('(max-width: 912px)').matches) {
        setScreen('tab');
        screenRatio = 0.75;
    } else if (window.matchMedia('(min-width: 1024px)').matches) {
        setScreen('desk');
        screenRatio = 1.6;
    } 

    parts.forEach((part: Element) => {
        const partWidth = part.clientWidth;
        
        if (part instanceof HTMLElement) {
            if (part.id === 'central') {
                part.style.cssText = `height: ${partWidth/screenRatio}px; transform: translateZ(-${partWidth*Math.sin(17.5*Math.PI/180)}px);`;
            } else {
                part.style.cssText = `height: ${partWidth/screenRatio}px;`;
            }
        }
    })

    pepe.forEach((p) => {
        p.childNodes.forEach((span, idx) => {
            if (span instanceof HTMLElement && span.nodeType === 1) {
                let delay = Math.ceil(p.childNodes.length / 2) - idx;
                delay = 2.2 + delay/15;
                span.style.animationDelay = `${delay}s`;
            }
        })
    })

    const handleStartAction = () => {
        container.classList.add('start');
        const time = setTimeout(() => {
            (page.querySelector('audio.one') as HTMLAudioElement).play();
            clearTimeout(time);
        }, 1000)

        btn.style.display = 'none';

        const time2 = setTimeout(() => {
            domain.classList.add('expand');
            clearTimeout(time2);
        }, 3500);

        const time3 = setTimeout(() => {
            partsContainer.classList.remove('none');
            partsContainer.classList.add('show');

            startSecondStage();
            clearTimeout(time3);
        }, 13000)

        btn.removeEventListener('click', handleStartAction);
    };

    btn.addEventListener('click', handleStartAction);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
      <div className='intro-page'>
          <div className="container">
              <div>
                  <div className="blur">
                      <p>
                          <span>D</span>
                          <span>o</span>
                          <span>m</span>
                          <span>a</span>
                          <span>i</span>
                          <span>n</span>
                          <span>&nbsp;</span>
                          <span>E</span>
                          <span>x</span>
                          <span>p</span>
                          <span>a</span>
                          <span>n</span>
                          <span>s</span>
                          <span>i</span>
                          <span>o</span>
                          <span>n</span>
                      </p>
                  </div>
                  <div className="clear">
                      <p>
                          <span>D</span>
                          <span>o</span>
                          <span>m</span>
                          <span>a</span>
                          <span>i</span>
                          <span>n</span>
                          <span>&nbsp;</span>
                          <span>E</span>
                          <span>x</span>
                          <span>p</span>
                          <span>a</span>
                          <span>n</span>
                          <span>s</span>
                          <span>i</span>
                          <span>o</span>
                          <span>n</span>
                      </p>
                  </div>
              </div>
          </div>

          <div className="domain-container">
              <img src={mandelbrotSet} alt="" />
          </div>

          <div className="parts-container none">
            <span className='show-tip' onClick={handleShowTip}>
                <FaExclamation />
            </span>
            <div>
                <div id="entertainment" data-title="Entertainment" className="part entertainment">
                    <img rel='preload' loading='lazy' src={screen === 'mob' ? EntertainmentMobile 
                    : screen === 'tab' ? EntertainmentTablet 
                    : Entertainment} alt="" />
                    <div className="part-title">
                      <div>
                      <h3>Entertainment</h3>
                      </div>
                    </div>
                    <span className="shadow"></span>
                </div>
                <div id="learning-tracker" data-title="Learning Tracker" className="part learning-tracker">
                    <img rel='preload' loading='lazy' src={screen === 'mob' ? LearningTrackerMobile 
                    : screen === 'tab' ? LearningTrackerTablet 
                    : LearningTracker} alt="" />
                    <div className="part-title">
                        <div>
                        <h3>Learning Tracker</h3>
                        </div>
                    </div>
                    <span className="shadow"></span>
                </div>
                <div id="central" data-title="The Central" className="part central">
                    <img rel='preload' loading='lazy' src={screen === 'mob' ? CentralMobile 
                    : screen === 'tab' ? CentralTablet 
                    : Central} alt="" />
                    <div className="part-title">
                      <div>
                      <h3>The Central</h3>
                      </div>
                    </div>
                    <span className="shadow"></span>
                </div>
                <div id="sessions-manager" data-title="Sessions Manager" className="part sessions-manager">
                    <img rel='preload' loading='lazy' src={screen === 'mob' ? SessionsManagerMobile 
                    : screen === 'tab' ? SessionsManagerTablet 
                    : SessionsManager} alt="" />
                    <div className="part-title">
                        <div>
                        <h3>Sessions Manager</h3>
                        </div>
                    </div>
                    <span className="shadow"></span>
                </div>
                <div id="goals" data-title="Goals" className="part goals">
                    <img rel='preload' loading='lazy' src={screen === 'mob' ? GoalsMobile 
                    : screen === 'tab' ? GoalsTablet 
                    : Goals} alt="" />
                    <div className="part-title">
                          <div>
                          <h3>Goals</h3>
                          </div>
                    </div>
                    <span className="shadow"></span>
                </div>
            </div>
          </div>

          <div className="action-btns hide">
              {!authenticated ? (
                <>
                <button onClick={()=>{location.assign('/register')}}>Create Profile</button>
                <button onClick={()=>{location.assign('/login')}}>Login</button>
                </>
              ): (
                <button onClick={()=>{location.assign('/central')}}>Go to the Central</button>
              )}
          </div>

          <button className="start">Start</button>

          <audio className="one"src={domainExpansion}></audio>
          <audio className="two" src={audio}></audio>

          {showPartDetails && createPortal(<PartDetails name={partName as string} description={partDescription as string} setShowPartDetails={setShowPartDetails} />, document.querySelector('.intro-page') as Element)}

      </div>
  )
}

export default Intro;