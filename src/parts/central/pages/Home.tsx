import {useState, useEffect, DragEvent, MouseEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import { FaListUl } from "react-icons/fa";
import CardsIco from '../../../assets/cards.svg';
import { FadeLoader } from 'react-spinners';
import {MissionsList, Entertainment} from '../../../types/types'
import {AxiosError} from 'axios'
import { 
  createApi,
  handleGetCourse,
  handleGetProject,
  handleGetEntertainment
} from '../api';

import Seperator from '../components/Seperator';
import ListMission from '../components/Mission';

const api = createApi(import.meta.env.VITE_API_BASE_URL+'missions/apis/');


function Home({title}: {title: string}) {
  
  const [data, setData] = useState<MissionsList | null>();
  const [status, setStatus] = useState<'loading' | 'loaded'>('loading');
  const [listStyle, setListStyle] = useState<string>('list');
  const [reward, setReward] = useState<Entertainment | null>();


  const navigator = useNavigate();

  useEffect(() => {
    document.title = title;
    handleFetchTodayList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (listStyle === 'cards') {

      if (window.matchMedia('(max-width: 545px)').matches) {
        console.log('works')
        const allCards: NodeListOf<HTMLDivElement> = document.querySelectorAll('.missions-container.cards .missions-card');
        console.log(allCards)
        const handleDivCards = (card: HTMLDivElement) => {
          // (card.parentElement as HTMLElement).ontouchstart = (e) => {
          //   e.stopPropagation();
          // }
          card.onclick = () => {
            console.log('something');
            allCards.forEach(card => {card.parentElement?.classList.remove('active')});
            card.parentElement?.classList.add('active');
            card.parentElement?.parentElement?.classList.add(card.classList[0])
          };

          // card.onmouseleave = () => {
          //   card.parentElement?.classList.remove('active');
          //   card.parentElement?.classList.remove(card.parentElement?.classList[0])
          //   allCards.forEach(card => {card.classList.contains('working-card') ? card.parentElement?.classList.add('active'): null});
          // }
        }
        
        allCards.forEach(handleDivCards);
      } else {
        console.log('no works')
        const allCards: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.missions-container.cards > span');

        const handleSpanCard = (card: HTMLSpanElement) => {
          card.onmouseover = () => {
            allCards.forEach(card => {card.classList.remove('active')});
            card.classList.add('active');
            card.parentElement?.classList.add(card.classList[0])
          };
  
          card.onmouseleave = () => {
            card.classList.remove('active');
            card.parentElement?.classList.remove(card.classList[0])
            allCards.forEach(card => {card.classList.contains('working') ? card.classList.add('active'): null});
          }
        }

        allCards.forEach(handleSpanCard)
      }
    
    }
  
  }, [listStyle])


  async function handleFetchTodayList() : Promise<undefined | null> {
    try {
      // Constructing today's date
      let date: string | Date = new Date();
      const day = date.getDate().toString();
      const month = (date.getMonth()+1).toString();
      const year = date.getFullYear();
      date = `${year}-${month.length === 2 ? month : '0'+month}-${day.length === 2 ? day: '0'+day}`;

      const response = await api.get('lists/today/'+date+'/')

      if (response.status === 200) {
        const data: MissionsList = await response.data;
      
        data.missions?.forEach(async (mission) => {
          if (mission.project) {
            mission.related = await handleGetProject(mission.project as number);
            mission.related && (mission.related.route = '/sessions-manager/projects/');
          } else if (mission.course) {
            mission.related = await handleGetCourse(mission.course as number);
            mission.related && (mission.related.route = '/learning-tracker/courses/');
          }
        })  
      
        if (data.reward) {
          const reward = await handleGetEntertainment(data.reward);
          setReward(reward);
        }

        setListStyle(data['style'] as string);
        setData(data);
        setStatus('loaded');
      }

    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 404) {
          console.log('hello 404')
          setStatus('loaded');
        } else if (error.status === 401 || error.status === 403) {
          navigator('/login/');

        }
      } else {
        console.log(error);

      }

      return null;
    }
  }


  async function handleUpdateMissionOfCards(missionID: number, data: {status: string}) {
    try {
      const response = await api.patch(`missions/${missionID}/`, data);

      if (response.status === 202) {
        return true;
      } else if (response.status === 200) {
        window.location.reload();
      }

    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 500 || error.status === 400) {
          alert('Something wen wrong, please try again.');
        }
      }
      console.log('Error :\n',error);
    }
  }
 

  async function handleSetListStyle(style: string) {
    try {
      const res = await api.post('set-cookie/', {key: 'list_style', value: style, life: 'long'});

      if (res.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      alert('Something went wrong try again later.')
    }
  }

  function handleExtendMissionOfCard(e: MouseEvent<HTMLButtonElement>) {
    (e.target as HTMLButtonElement)?.parentElement?.querySelector('.related-object')?.classList.toggle('show');
    (e.target as HTMLButtonElement).classList.toggle('extend');
  }

  // Handling Drag-drop functionality
  function handleDragStart(e: DragEvent<HTMLElement>) {
    e.dataTransfer.setData("text", (e.target as HTMLElement).id);
  }

  function handleDragOver(e: DragEvent<HTMLElement>) {
    e.preventDefault();
  }

  async function handleDrop(e: DragEvent<HTMLElement>, status: string) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");

    if (await handleUpdateMissionOfCards(parseInt(data.split('-')[1]),{status})){
      (e.target as HTMLElement).appendChild(document.getElementById(data as string) as HTMLElement);
    }
  }


  return (
    <div className='home-page page'>
      {!data ? (
        <>
        {status === 'loading' ? (
          <FadeLoader color='#c0c0c0' height={18} width={6} />
        ) : (
          <h2>No list for today</h2>
        )}
        </>
      ): !data.done ? (
        <>
          <div className='list-style'>
            <FaListUl onClick={() => {handleSetListStyle('list')}} title='List' />
            <img onClick={() => {handleSetListStyle('cards')}} title='Cards' id='CardsIco' src={CardsIco} alt="" />
          </div>
          <h2 className="list-title">{data['title']}</h2>
          <br />
          <div className={`missions-container ${listStyle === 'cards' ? 'cards' : 'list'}`}>
            {listStyle === 'cards' ? (
              <>
                <span className='pending'>
                  <div className="missions-card pending-card">
                    <h3>Pending</h3>
                    <div className="missions"
                        onDrop={(e) => {handleDrop(e, 'pending')}}
                        onDragOver={handleDragOver}
                    >
                      {data['missions']?.filter((mission) => {
                          return mission.status === 'pending';
                      }).map(mission => {
                        return (
                          <div id={`mission-${mission.id}`} 
                              draggable="true" 
                              onDragStart={handleDragStart}
                              onDrop={(e) => {e.preventDefault()}}
                          >
                            <p>
                              {mission.content}
                            </p>
                            {mission.related && (
                              <>
                                <a href={`${mission.related.route}${mission.related.id}`} target='_blank' className="related-object">
                                  <span>{mission.related.title}</span>
                                </a>
                                <button onClick={handleExtendMissionOfCard} className='extend-mission-btn'>
                                  <IoIosArrowDown />
                                </button>
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </span>
                <span className='working active'>
                  <div className="missions-card working-card">
                    <h3>Being Done</h3>
                    <div className="missions"
                        onDrop={(e) => { handleDrop(e, 'working')}}
                        onDragOver={handleDragOver}>
                    {data['missions']?.filter((mission) => {
                          return mission.status === 'working';
                      }).map(mission => {
                        return (
                          <div id={`mission-${mission.id}`} 
                              draggable="true"
                              onDragStart={handleDragStart} 
                              onDrop={(e) => {e.preventDefault()}}>
                            <p>
                              {mission.content}
                            </p>
                            {mission.related && (
                              <>
                                <a href={`${mission.related.route}${mission.related.id}`} target='_blank' className="related-object">
                                  <span>{mission.related.title}</span>
                                </a>
                                <button onClick={handleExtendMissionOfCard} className='extend-mission-btn'>
                                  <IoIosArrowDown />
                                </button>
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </span>
                <span className='done'>
                  <div className="missions-card done-card">
                    <h3>Done</h3>
                    <div className="missions" 
                        onDrop={(e) => {handleDrop(e, 'done')}}
                        onDragOver={handleDragOver}>
                    {data['missions']?.filter((mission) => {
                          return mission.status === 'done';
                      }).map(mission => {
                        return (
                          <div id={`mission-${mission.id}`} 
                              draggable="true"
                              onDragStart={handleDragStart}
                              onDrop={(e) => {e.preventDefault()}}
                          >
                            <p>
                              {mission.content}
                            </p>
                            {mission.related && (
                              <>
                                <a href={`${mission.related.route}${mission.related.id}`} target='_blank' className="related-object">
                                  <span>{mission.related.title}</span>
                                </a>
                                <button onClick={handleExtendMissionOfCard} className='extend-mission-btn'>
                                  <IoIosArrowDown />
                                </button>
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </span>
              </>
            ): data['missions']?.map(mission => {
              return (
                <ListMission mission={mission} readonly={false} />
              )
            })}
          </div>
          {reward && (
            <>
              <Seperator />
              <h2>Reward</h2>
              <br />
              <div className={`reward-container ${reward.locked && 'locked'}`}>
                
                <a onClick={(e) => {reward.locked && e.preventDefault()}} href={`/entertainment/materials/${reward.id}/`}>
                  <div className={`reward-img`}>
                    <img src={reward.image} alt="" />
                  </div>
                  <h3>{reward.title}</h3>
                </a>
              </div>
            </>
          )}
        </>
      ): (
        <>
        <h2 className="list-title">You have done today's list!</h2>
        <Seperator />
        {reward && (
          <>
            <h2>Your Reward</h2>
            <br />
            <div className={`reward-container`}>
              <a href={`/entertainment/materials/${reward.id}/`}>
                <div className={`reward-img`}>
                  <img src={reward.image} alt="" />
                </div>
                <h3>{reward.title}</h3>
              </a>
            </div>
          </>
        )}
        </>
      )}
    </div>
  )
}

export default Home;