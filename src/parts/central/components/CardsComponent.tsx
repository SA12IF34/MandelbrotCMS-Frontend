import {DragEvent} from 'react';
import {MissionsList, RelatedObj} from '../../../types/types';
import {AxiosInstance, AxiosError} from 'axios';

import DraggableMission from './DraggableMission';

type props = {
    data: MissionsList,
    api: AxiosInstance
}

function CardsComponent({data, api}: props) {

  
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

  return (
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
                <DraggableMission mission={mission} related={mission.related as RelatedObj} handleDragStart={handleDragStart} />
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
                <DraggableMission mission={mission} related={mission.related as RelatedObj} handleDragStart={handleDragStart} />
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
                <DraggableMission mission={mission} related={mission.related as RelatedObj} handleDragStart={handleDragStart} />
              )
            })}
          </div>
        </div>
      </span>
    </>
  )
}

export default CardsComponent