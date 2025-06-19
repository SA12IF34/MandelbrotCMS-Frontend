import {useState, useRef, useEffect} from 'react';
import { LuMinus, LuPlus } from "react-icons/lu";

import {api, createApi, handleError} from '../api';
import type { Mission, Entertainment, Project, Course, RelatedObj } from '../../../types/types';

import Seperator from '../components/Seperator';
import ListMission from '../components/Mission';
import { AxiosError } from 'axios';

function CreateNewList({title}: {title: string}) {
  
  const [addMission, setAddMission] = useState<boolean>(false);
  const [missions, setMissions] = useState<Array<Mission>>([]);
  const [objSearchResults, setObjSearchResults] = useState<Array<Project | Course>>([]);
  const [relatedObj, setRelatedObj] = useState<RelatedObj | null>(null);
  const [rewardSearchResults, setRewardSearchResults] = useState<Array<Entertainment>>([]);
  const [reward, setReward] = useState<Entertainment | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  const missionContentRef = useRef<HTMLDivElement | null>(null);
  const relatedObjSearchRef = useRef<HTMLInputElement | null>(null);
  const lockRewardRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.title = title;
    // eslint-disable-next-line
  }, [])

  async function handleSearchObjects(searchTerm: string) {
    if (searchTerm.length === 0) {
      setObjSearchResults([]);
      return;
    }
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const res1 = await createApi(baseURL+'sessions_manager/apis/').get('projects/?search='+searchTerm);
      const res2 = await createApi(baseURL+'learning_tracker/apis/').get('courses/?search='+searchTerm);

      if (res1.status === 200 && res2.status === 200) {
        const data1:Project[] = await res1.data;
        const data2:Course[] = await res2.data;

        setObjSearchResults([...data1, ...data2]);
      }

    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 500) {
          alert('Something went wrong, please try again.');
        }
      }

      console.log('Error: /n', error);
    }
  }

  async function handleSearchRewards(searchTerm: string) {
    try {
      const res = await createApi(import.meta.env.VITE_API_BASE_URL+'entertainment/apis/').get('search/?title='+searchTerm);

      if (res.status === 200) {
        const data = await res.data;

        setRewardSearchResults(data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 500) {
          alert('Something went wrong, please try again.');
        }
      }

      console.log('Error: /n', error);
    }
  }

  async function handleCreateList() {
    if (missions.length === 0) {
      alert('You must have at least one mission to create a list.');
      return;
    } 

    try {
      // Collecting Data
      const cleanedMissions = missions.map(mission => {
        if (mission.related) {
          delete mission.related
        }
        return mission;
      });

      const data = {
        list: {
          title: titleRef.current?.value,
          date: dateRef.current?.value,
          reward: reward ? reward.id : null,
          lock_reward: lockRewardRef.current?.checked
        },
        missions: cleanedMissions
      };

      const response = await api.post('lists/', data);

      if (response.status === 201) {
        window.location.assign('/central');
      }

    } catch (error) {

      if (error instanceof AxiosError) {
        if (error.status === 409) {
          alert('You already have a list with this date.');
        }
      } 

      return handleError(error);
    }
  }

  function handleAddMission() {
    if (missionContentRef.current?.textContent?.length === 0) {
      alert('Fill mission content before adding it.');
      return;
    } 
    const missionData = {
      content: missionContentRef.current?.textContent as string,
      project: relatedObj && relatedObj?.type === 'project' ? relatedObj.id : null,
      course: relatedObj && relatedObj?.type === 'course' ? relatedObj.id: null,
      related: relatedObj as RelatedObj
    };

    setMissions([...missions, missionData as Mission]);
    setRelatedObj(null);
    setObjSearchResults([]);
    setAddMission(false);
  }


  return (
    <div className='page create-list-page'>
      <form onSubmit={(e) => {e.preventDefault()}} className='list-form' action="">
        <section className='main-info'>
          <input autoComplete='off' ref={titleRef} type="text" id="list-title" placeholder='Missions List Title' required />
          <input ref={dateRef} type="date" name="" id="list-date" placeholder='Date Of Execution' required />
        </section>
        <Seperator />
        <section className='missions'>
          <div className="label">
            <h2>Missions</h2>
            <button onClick={() => {
                if (missionContentRef.current && relatedObjSearchRef.current) {
                  missionContentRef.current.textContent = '';
                  relatedObjSearchRef.current.value = '';
                }
                setRelatedObj(null);
                setObjSearchResults([]);
                setAddMission(addMission => !addMission);
              }} className="add-mission">
              {!addMission ? (<LuPlus />) : (<LuMinus />)}
            </button>
          </div>
          {missions.length > 0 && (<br />)}
          <div className="missions-container list">
            {missions.length > 0 && missions.map(mission => {
              return (
                <ListMission mission={mission} readonly={true} />
              )
            })
            }
          </div>
          {addMission && (
            <div className="mission-create-form">
              <div ref={missionContentRef} className='custom-textarea' contentEditable data-placeholder='Mission Content'></div>
              <span className="sep"></span>
              <div className="related-obj-field">
                {!relatedObj ? (
                  <>
                  <div className='search-field'>
                    <input ref={relatedObjSearchRef} onInput={(e) => {handleSearchObjects((e.target as HTMLInputElement).value)}} type="text" name="" id="" placeholder='Type Project or Course Titles' />
                  </div>
                  <div className="obj-search-results">
                    {objSearchResults.length > 0 && objSearchResults.map(obj => {
                      
                      return (
                        <div onClick={() => {setRelatedObj({id: obj.id, title: obj.title, type: (obj as Project).start_date ? 'project': 'course'})}}>
                          <span>{obj.title}</span>
                        </div>
                      )
                    })}
                  </div>
                  </>
                ) : (
                  <div className="related-obj">
                    <h3>{relatedObj.title}</h3>
                    <button title='remove related object' onClick={() => {setRelatedObj(null)}}>
                      <LuMinus />
                    </button>
                  </div>
                )}
              </div>
              <button onClick={handleAddMission} className="add-mission-2">
              <LuPlus />
              </button>
            </div>
          )}
        </section>
        <Seperator />
        <section className='reward'>
          <div className="label">
            <h2>Reward</h2>
          </div>
          <br />
          <div className="reward-form">
            <div className="reward-search">
              <div className="search-field">
                <input onInput={(e) => {handleSearchRewards((e.target as HTMLInputElement).value)}} type="text" placeholder='Type reward title or part of it' />
                <div className="rewards-container">
                  {rewardSearchResults.length > 0 && rewardSearchResults.map(reward => {
                    return (
                      <div onClick={() => {setReward(reward)}}>
                        <img src={reward.image} alt="" />
                        <h4>{reward.title}</h4>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            {reward && (<>
              <span className="sep"></span>
              <div className="chosen-reward">
                <div className="reward-img">
                  <img src={reward.image} />
                </div>
                
                <div className="reward-info">
                  <h4>{reward.title.length > 29 ? reward.title.slice(0, 30) + '...' : reward.title}</h4>
                  <div>
                    <label className="switch">
                      <input ref={lockRewardRef} id='lock-reward' type="checkbox" />
                      <span className="slider"></span>
                    </label>
                    <label htmlFor="lock-reward">Lock Reward</label>
                  </div>
                </div>

                <button title='remove reward' onClick={() => {setReward(null)}}>
                  <LuMinus />
                </button>
              </div>
              </>)}
          </div>
        </section>
        <Seperator />
        <button onClick={handleCreateList} className='submit-btn' type="submit">Create List</button>
      </form>
    </div>
  )
}

export default CreateNewList