import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
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

import CardsComponent from '../components/CardsComponent';

import Seperator from '../components/Seperator';
import ListMission from '../components/Mission';

import 'drag-drop-touch';

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


  const handleSwapCards = (xStart: number, xEnd: number) => {

    const workingContainer: HTMLSpanElement = document.querySelector('span.working') as HTMLSpanElement;
    const pendingContainer: HTMLSpanElement = document.querySelector('span.pending') as HTMLSpanElement;
    const doneContainer: HTMLSpanElement = document.querySelector('span.done') as HTMLSpanElement;

    const left = (xEnd - xStart) < -30;
    const right = (xEnd - xStart) > 30;
    
    if (left) {
      if (workingContainer.classList.contains('active')) {
        workingContainer.classList.remove('active');
        workingContainer.parentElement?.classList.remove('working')
        doneContainer.classList.add('active');
        workingContainer.parentElement?.classList.add('done');

      } else if (doneContainer.classList.contains('active')) {
        doneContainer.classList.remove('active');
        doneContainer.parentElement?.classList.remove('done')
        pendingContainer.classList.add('active');
        doneContainer.parentElement?.classList.add('pending')
      
      } else if (pendingContainer.classList.contains('active')) {
        pendingContainer.classList.remove('active');
        pendingContainer.parentElement?.classList.remove('pending')
        workingContainer.classList.add('active');
        pendingContainer.parentElement?.classList.add('working')
      }
    
    } else if (right) {
      if (workingContainer.classList.contains('active')) {
        workingContainer.classList.remove('active');
        workingContainer.parentElement?.classList.remove('working')
        pendingContainer.classList.add('active');
        workingContainer.parentElement?.classList.add('pending');
        
      } else if (pendingContainer.classList.contains('active')) {
        pendingContainer.classList.remove('active');
        pendingContainer.parentElement?.classList.remove('pending')
        doneContainer.classList.add('active');
        pendingContainer.parentElement?.classList.add('done')
      
      } else if (doneContainer.classList.contains('active')) {
        doneContainer.classList.remove('active');
        doneContainer.parentElement?.classList.remove('done')
        workingContainer.classList.add('active');
        doneContainer.parentElement?.classList.add('working')
      
      }
    }
  }

  useEffect(() => {
    if (listStyle === 'cards') {

      if (window.matchMedia('(max-width: 545px)').matches) {


        let xStart: number;
        (document.querySelector('.missions-container.cards') as HTMLElement).ontouchstart = (e: TouchEvent) => {

          xStart = e.touches[0].clientX;
        };

        (document.querySelector('.missions-container.cards') as HTMLElement).ontouchend = async (e:TouchEvent) => {

          const xEnd = e.changedTouches[0].clientX;
          handleSwapCards(xStart, xEnd)
        }


      } else {
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
              <CardsComponent data={data} api={api} />
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