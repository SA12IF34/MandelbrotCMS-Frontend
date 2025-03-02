import { MouseEvent } from 'react';
import { IoCheckmark } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';
import type { Mission } from '../../../types/types';
import { AxiosError } from 'axios';
import { api } from '../api';

function ListMission({mission, readonly}: {mission: Mission, readonly: boolean}) {

  async function handleUpdateMissionOfList(e: MouseEvent<HTMLButtonElement>, missionID: number, data: {status: string}) {
    try {
      const response = await api.patch(`missions/${missionID}/`, data);

      if (response.status === 202) {
        if (data.status === 'done') {
          document.querySelector(`#mission-${missionID}`)?.classList.add('done');
        } else {
          document.querySelector(`#mission-${missionID}`)?.classList.remove('done');
        }
        (e.target as HTMLButtonElement).classList.toggle('checked')
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

  function handleExtendMissionOfList(e: MouseEvent<HTMLButtonElement>) {
    (e.target as HTMLElement)?.parentElement?.querySelector('.related-object')?.classList.toggle('show');
    (e.target as HTMLElement).classList.toggle('extend');
  }
 
 
  return (
    <div>
      <div id={`mission-${mission.id}`} className={`mission-content ${mission.status === 'done' && 'done'}`}>
        {!readonly && (
            <button onClick={(e) => {handleUpdateMissionOfList(e, mission.id as number, {status: mission.status === 'done' ? 'pending': 'done'})}} className={`mission-check ${mission.status === 'done' && 'checked'}`}>
              <IoCheckmark />
            </button>
        )}
        <p>{mission['content']}</p>
      </div>
      {mission.related && (<>
          <a href={`${mission.related.route}${mission.related.id}`} target='_blank' className="related-object">
            <span>{mission.related.title}</span>
          </a>
          <button onClick={handleExtendMissionOfList} className='extend-mission-btn'>
            <IoIosArrowDown />
          </button>
      </>)}
      {readonly && (
        <>
        </>
      )}
    </div>
  )
}

export default ListMission