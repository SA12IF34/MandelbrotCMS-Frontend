import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { MdOpenInFull } from "react-icons/md";
import { Entertainment } from '../../../types/types';

type ActiveType = 'anime&manga'
                  | 'shows&movies'
                  | 'game'
                  | 'other';

interface Materials {
    'anime&manga': Array<Entertainment>,
    'shows&movies': Array<Entertainment>,
    'game': Array<Entertainment>,
    'other': Array<Entertainment>,
}


function MaterialsContainer({materials, status='', currentActive='anime&manga', one=false}: {materials: Materials | Entertainment[] | undefined, status?: string, currentActive?:ActiveType, one?: boolean}) {
  const [animeAndManga, setAnimeAndManga] = useState<Array<Entertainment>>();
  const [showsAndMovies, setShowsAndMovies] = useState<Array<Entertainment>>();
  const [game, setGames] = useState<Array<Entertainment>>();
  const [other, setOther] = useState<Array<Entertainment>>();

  const [activeMaterials, setActiveMaterials] = useState<Array<Entertainment>>();

  const [active, setActive] = useState<ActiveType>(currentActive);

  useEffect(() => {
    if (materials) {
        if (one) {
            setActiveMaterials(materials as Entertainment[]);
        } else {

            setAnimeAndManga((materials as Materials)['anime&manga']);
            setShowsAndMovies((materials as Materials)['shows&movies']);
            setGames((materials as Materials)['game']);
            setOther((materials as Materials)['other']);
        }
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materials])

  useEffect(() => {
    if (!one) {
        const types = document.querySelectorAll(`.materials-container.${status} .types button`);
        types.forEach(type => {
        if (type.id === active) {
            type.classList.add('active');
        }

        type.addEventListener('click', () => {
            types.forEach(type => type.classList.remove('active'));
            type.classList.add('active');
            setActive(type.id as ActiveType);
        })})

        switch (active) {
            case 'anime&manga':
                setActiveMaterials(animeAndManga);
                break;
            
            case 'shows&movies':
                setActiveMaterials(showsAndMovies);
                break;
            
            case 'game':
                setActiveMaterials(game);
                break;
            
            case 'other':
                setActiveMaterials(other);
                break;

            default:
                break;
        }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, materials, animeAndManga, showsAndMovies, game, other]);

  useEffect(() => {
    setActive(currentActive)

    const types = document.querySelectorAll(`.materials-container.${status} .types button`);

    types.forEach(type => {
        type.classList.remove('active');
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentActive])

  function handleGoLeft() {
    const container = document.querySelector(`.materials-container.${(status || currentActive).replace('&', '\\&')} .materials`);
    if (container) {
        if (container.scrollLeft > 0) {
            container.scrollTo({
                left: container.scrollLeft - (container.querySelector('.material')?.clientWidth as number) - 30,
                behavior: 'smooth'
            });

        }
    }
  }

  function handleGoRight() {
    const container = document.querySelector(`.materials-container.${(status || currentActive).replace('&', '\\&')} .materials`);
    if (container) {
        container.scrollTo({
            left: container.scrollLeft + (container.querySelector('.material')?.clientWidth as number) + 30,
            behavior: 'smooth'
        });
    }
  }

  const [longPressLeft, setLongPressLeft] = useState<number | null>(null);
  const [longPressRight, setLongPressRight] = useState<number | null>(null)

  function handleGoLeftAll(container: HTMLElement) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' })
  }

  function handleGoLeftZero(container: HTMLElement) {
      container.scrollTo({ left: 0, behavior: 'smooth' })
  }

  function handleLeftMouseDown() {
      const container = document.querySelector(`.materials-container.${(status || currentActive).replace('&', '\\&')} .materials`) as HTMLElement;
      const timer = window.setTimeout(() => {
          if (container) handleGoLeftZero(container);
      }, 600);
      setLongPressLeft(timer);
  }

  function handleLeftMouseUp() {
      if (longPressLeft) clearTimeout(longPressLeft);
      setLongPressLeft(null);
  }

  function handleRightMouseDown() {
      const container = document.querySelector(`.materials-container.${(status || currentActive).replace('&', '\\&')} .materials`) as HTMLElement;
      const timer = window.setTimeout(() => {
          if (container) handleGoLeftAll(container);
      }, 600);
      setLongPressRight(timer);
  }

  function handleRightMouseUp() {
      if (longPressRight) clearTimeout(longPressRight);
      setLongPressRight(null);
  }


  return (
    <div className={`materials-container ${status} ${currentActive}`}>
        {!one && (
            <div className="types">
                <button id="anime&manga" >Anime&Manga</button>
                <button id="shows&movies" >Shows&Movies</button>
                <button id="game" >Games</button>
                <button id="other" >Other</button>
            </div>
        )}
        <Link className="view-all" to={`/entertainment/search/?status=${status}&type=${encodeURIComponent(active)}&special=${one ? 'true': 'false'}`}>
        <MdOpenInFull />
        </Link>
        <div className="materials">
            {!activeMaterials ? (
                <FadeLoader color='#f5f5f5' height={18} width={6} />
            ): activeMaterials.length > 0 ? activeMaterials.map(material => {
                return (
                    <Link key={material.id} to={'/entertainment/materials/' + material.id}>
                        <div title={material.title} className="material">
                            <div className="img-container">
                                <img src={material.image_upload ? material.image_upload : material.image} alt="" />
                            </div>
                            <div>
                                <span>{material.title.length > 35 ? material.title.slice(0, 36)+'...' : material.title}</span>
                            </div>
                        </div>
                    </Link>
                )
            }): (
                <div>No materials found</div>
            )}
        </div>
        <button onMouseDown={handleLeftMouseDown} onMouseUp={handleLeftMouseUp} onClick={handleGoLeft} className='left'>  
            <SlArrowLeft />
        </button>
        <button onMouseDown={handleRightMouseDown} onMouseUp={handleRightMouseUp} onClick={handleGoRight} className='right'>  
            <SlArrowRight />
        </button>
    </div>
  )
}

export default MaterialsContainer;