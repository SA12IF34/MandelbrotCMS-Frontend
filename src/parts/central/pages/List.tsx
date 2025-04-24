import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { AxiosError } from "axios";
import { MissionsList, Entertainment } from "../../../types/types";
import { 
  api, 
  handleError, 
  handleGetCourse, 
  handleGetEntertainment, 
  handleGetProject 
} from "../api"; 

import Seperator from "../components/Seperator";
import ListMission from "../components/Mission";


function List() {
  const {id} = useParams();
  const navigator = useNavigate();

  const [list, setList] = useState<MissionsList>()
  const [reward, setReward] = useState<Entertainment>();

  async function handleGetList() {
    try {
      const response = await api.get(`lists/${id}/`);

      if (response.status === 200) {
        const data: MissionsList = await response.data;

        document.title = data['title'];

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

        setList(data);
      }

    } catch (error) {

      if (error instanceof AxiosError) {
        if (error.status === 404) {
          navigator('/central/not-found');
        }
      }

      return handleError(error)
    }
  }

  async function handleDeleteList() {
    try {
      const response = await api.delete(`lists/${id}/`);

      if (response.status === 204) {
        window.history.back();
      }

    } catch (error) {
      return handleError(error);
    }
  }


  useEffect(() => {
    handleGetList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <div className="page list-page">
      {list ? (
        <>
        <h2 className="list-title">{list.title}</h2>
        <br />
        <div className="missions-container list">
          {list.missions?.map(mission => {
            return (
              <ListMission mission={mission} readonly={true} />
            )
          })}
        </div>
        {reward && (
          <>
          <Seperator />
          <h2>Reward</h2>
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
        <button onClick={handleDeleteList} className="submit-btn">Delete</button>
        </>
      ) : (
        <FadeLoader color="#c0c0c0" height={18} width={6} />
      )}
    </div>
  )
}

export default List

