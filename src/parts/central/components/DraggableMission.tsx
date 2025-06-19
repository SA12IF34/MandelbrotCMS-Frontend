import {MouseEvent, DragEvent, useState, useEffect} from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import {RelatedObj, Mission} from '../../../types/types';


type props = {
    mission: Mission,
    related: RelatedObj,
    handleDragStart: (e: DragEvent<HTMLElement>) => void
}

function DraggableMission({mission, related, handleDragStart}: props) {

  const [status, setStatus] = useState<'pending' | 'working' | 'done'>(mission.status);

  function handleExtendMissionOfCard(e: MouseEvent<HTMLButtonElement>) {
    (e.target as HTMLButtonElement)?.parentElement?.querySelector('.related-object')?.classList.toggle('show');
    (e.target as HTMLButtonElement).classList.toggle('extend');
  }

  useEffect(() => {

    if (window.matchMedia('(max-width: 545px)').matches) {
      const missionEle = document.getElementById(`mission-${mission.id}`) as HTMLElement;

      let timeout: ReturnType<typeof setTimeout>;

      missionEle.ontouchstart = () => {
        console.log('hello');
        timeout = setTimeout(() => {
          
          alert("Hello Mission");
        }, 700)
      }

      missionEle.ontouchend = () => {
        clearTimeout(timeout)
      }

      missionEle.ontouchmove = () => {
        clearTimeout(timeout)
      }
    
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id={`mission-${mission.id}`} 
        draggable="true" 
        onDragStart={handleDragStart}
        onDrop={(e) => {e.preventDefault()}}
    >
      <p>
        {mission.content}
      </p>
      {related && (
        <>
          <a href={`${related.route}${related.id}`} target='_blank' className="related-object">
            <span>{related.title}</span>
          </a>
          <button onClick={handleExtendMissionOfCard} className='extend-mission-btn'>
            <IoIosArrowDown />
          </button>
        </>
      )}
    </div>
  )
}

export default DraggableMission;