import {useState, useEffect, useRef, Dispatch, SetStateAction, MouseEvent} from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { LuMinus, LuPlus } from "react-icons/lu";
import { IoCheckmark, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { CiLock, CiUnlock } from "react-icons/ci";
import {FadeLoader} from 'react-spinners';
import {api, handleError, createApi} from '../api';
import { Entertainment, Mission, RelatedObj, Goal } from '../../../types/types'
import { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

function GoalContainer({form, id=null}: {form: boolean, id?: number | string | null}) {

  const navigator = useNavigate();

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const finishWordsRef = useRef<HTMLInputElement>(null);

  const [projects, setProjects] = useState<RelatedObj[]>([]);
  const [courses, setCourses] = useState<RelatedObj[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [rewards, setRewards] = useState<Entertainment[]>([]);

  const [goal, setGoal] = useState<Goal>();

  async function handleGetGoal() {
    try {
        const response = await api.get(`goals/${id}/`);

        if (response.status === 200) {
            const data = await response.data;
            
            document.title = data['title'];

            setGoal(data);
            setProjects(data?.projects || []);
            setCourses(data?.courses || []);
            setMissions(data?.missions || []);
            setRewards(data?.rewards || []);
        }

    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                navigator('/goals/not-found');
            }
        }
        handleError(error);
    }
  }

  async function handleDeleteGoal() {
    if (confirm('Are you serious you want to delete the goal?')) {
        try {
            const response = await api.delete(`goals/${id}/`);

            if (response.status === 204) {
                navigator('/goals');
            }

        } catch (error) {
            handleError(error)
        }
    }
  }

  async function handleCreateGoal() {
    try {
        const data = {
            title: titleRef.current?.value,
            description: descriptionRef.current?.value,
            projects: projects.map(project => project.id),
            courses: courses.map(course => course.id),
            missions: missions,
            rewards: rewards.map(reward => reward.id),
            finish_words: finishWordsRef.current?.value
        }

        const response = await api.post('goals/', data);

        if (response.status === 201) {
            navigator('/goals');
        }

    } catch (error) {
        handleError(error);
    }
  }

  async function handleSearchProjects(searchTerm: string): Promise<Array<RelatedObj>> {
    try {
        const response = await createApi(baseURL+'sessions_manager/apis/').get('projects/?search='+searchTerm);

        if (response.status === 200) {
            return await response.data;
        }

    } catch (error) {
        handleError(error);
    }

    return [];
  }

  async function handleSearchCourses(searchTerm: string): Promise<Array<RelatedObj>> {
    try {
        const response = await createApi(baseURL+'learning_tracker/apis/').get('courses/?search='+searchTerm);

        if (response.status === 200) {
            return await response.data;
        }

    } catch (error) {
        handleError(error);
    }

    return [];
  }

  async function handleSearchRewards(searchTerm: string): Promise<Array<Entertainment>> {
    try {
        const response = await createApi(baseURL+'entertainment/apis/').get('search/?title='+searchTerm);

        if (response.status === 200) {
            return await response.data;
        
        }

    } catch (error) {
        handleError(error);
    }

    return [];
  }

  async function handleCheckMission(missionId: number, data: {status: 'pending' | 'done'}) {
    try {
        const response = await createApi(baseURL).patch(`missions/apis/missions/${missionId}/`, data)
        if (response.status === 202) {
            setMissions(missions.map(mission => {
                if (mission && mission.id === missionId) {
                    window.location.reload();
                    mission['status'] = data['status'];

                    return mission;
                }
                return mission;
            }))
            
        }

    } catch (error) {
        handleError(error);
    }
  }

  function handleSearchProjectsPopup() {
    if (document.querySelector('.search-popup')) {
        return;
    }
    const div = document.createElement('div');
    const mainContainer = document.querySelector('.main-container');

    ReactDOM.createRoot(div).render(
        <SearchPopup handleSearch={handleSearchProjects} searchType='projects' specified={projects} setSpecified={setProjects as Dispatch<SetStateAction<Array<RelatedObj | Entertainment>>>} />
    )

    mainContainer?.appendChild(div);
  }

  function handleSearchCoursesPopup() {
    if (document.querySelector('.search-popup')) {
        return;
    }
    const div = document.createElement('div');
    const mainContainer = document.querySelector('.main-container');

    ReactDOM.createRoot(div).render(
        <SearchPopup handleSearch={handleSearchCourses} searchType='courses' specified={courses} setSpecified={setCourses as Dispatch<SetStateAction<Array<RelatedObj | Entertainment>>>} />
    )

    mainContainer?.appendChild(div);
  }

  function HandleCreateMissionPopup() {
    if (document.querySelector('.missions-popup')) {
        return;
    }
    const div = document.createElement('div');
    const mainContainer = document.querySelector('.main-container');

    ReactDOM.createRoot(div).render(
        <MissionsPopup missions={missions} setMissions={setMissions} />
    )

    mainContainer?.appendChild(div);
  }

  function handleSearchRewardsPopup() {
    if (document.querySelector('.search-popup')) {
        return;
    }
    const div = document.createElement('div');
    const mainContainer = document.querySelector('.main-container');

    ReactDOM.createRoot(div).render(
        <SearchPopup handleSearch={handleSearchRewards} searchType='rewards' specified={rewards} setSpecified={setRewards as Dispatch<SetStateAction<Array<RelatedObj | Entertainment>>>} />
    )

    mainContainer?.appendChild(div);

  }

  useEffect(() => {
    if (id && !form) {
        handleGetGoal()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className='goal-container'>
        <section className='info'>
            {form ? (<>
                <input ref={titleRef} type="text" placeholder={'Title'} />
                <textarea ref={descriptionRef} placeholder='Description'></textarea>
            </>): (<>
                <h2>{goal && goal.title}</h2>
                <p>{goal && goal.description}</p>
            </>)}
        </section>
        <section className='related'>
            <div>
                <div className="label">
                    <h3>Projects</h3>
                    {form && (
                        <button onClick={handleSearchProjectsPopup}>
                            <LuPlus />
                        </button>
                    )}
                </div>
                <div>
                    {projects.map(project => {
                        return (
                            <a target='_blank' href={`/sessions-manager/projects/${project.id}`} key={project.id} className='project'>
                                <h3>{project.title}</h3>
                                <p>
                                    {project.description && project.description.length > 40 
                                    ? project.description?.slice(0, 41) + '...'
                                    : project.description}
                                </p>
                                {project.status === 'completed' && (
                                    <span>
                                        <IoCheckmarkCircleOutline />
                                    </span>
                                )}
                            </a>
                        )
                    })}
                </div>
            </div>
            <div>
                <div className="label">
                    <h3>Courses</h3>
                    {form && (
                        <button onClick={handleSearchCoursesPopup}>
                            <LuPlus />
                        </button>
                    )}
                </div>
                <div>
                    {courses.map(course => {
                        return (
                            <a target='_blank' href={`/learning-tracker/courses/${course.id}`} key={course.id} className='course'>
                                <h3>
                                    {course.title && course.title.length > 25 
                                    ? course.title.slice(0, 26) + '...'
                                    : course.title}
                                </h3>
                                <p>
                                    {course.description && course.description.length > 40 
                                    ? course.description?.slice(0, 41) + '...'
                                    : course.description}
                                </p>
                                {course.status === 'done' && (
                                    <span>
                                        <IoCheckmarkCircleOutline />
                                    </span>
                                )}
                            </a>
                        )
                    })}
                </div>
            </div>
            <div>
                <div className="label">
                    <h3>Missions</h3>
                    {form && (
                        <button onClick={HandleCreateMissionPopup}>
                            <LuPlus />
                        </button>
                    )}
                </div>
                <div>
                    {missions.map(mission => {
                        return (
                            <div key={mission.id} className='mission'>
                                <h3>{mission.content}</h3>
                                {form ? (
                                    <button onClick={() => {
                                        setMissions(missions.filter(item => item !== mission));
                                    }}>
                                        <LuMinus />
                                    </button>
                                ) : (
                                    <button onClick={() => {
                                        handleCheckMission(mission.id as number, {status: mission.status === 'done'? 'pending': 'done'});
                                    }}>
                                        {mission.status === 'done' ? (
                                            <IoCheckmarkCircleOutline />
                                        ): mission.status === 'pending' && (
                                            <IoCheckmark />
                                        )}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
        {!form && (
            <section className="progress">
                <div className="label">
                    <h3>{goal?.progress === 100 ? 'Done!' : 'Progress'}</h3>
                </div>
                <div className="progress-bar">
                    <div className="progress" style={{width: goal?.progress+'%'}}></div>
                    <span className={goal?.progress === 100 ? 'done': ''} style={{left: goal?.progress+'%'}}>{goal?.progress}%</span>
                </div>
                
            </section>
        )}
        <section className='finish'>
            {form ? (
                <input ref={finishWordsRef} type="text" placeholder='Finish Words' />
            ): goal && (
                    <h2 className={!goal.done ? 'shadow-words' : ''}>{goal.finish_words}</h2>
                )
            }
            <div className="rewards">
                <div className="label">
                    <h3>Rewards</h3>
                    {form && (
                        <button onClick={handleSearchRewardsPopup}>
                            <LuPlus />
                        </button>
                    )}
                </div>
                <div>
                    {rewards.map(reward => {
                        return (
                          <div key={reward.id} className='reward'>
                              <div className="img">
                                  <img src={reward.image_upload || reward.image} alt="" />
                              </div>
                              <div>
                                <h3>
                                    {reward.title.length > 50 ? reward.title.slice(0, 51)+'...' : reward.title}
                                </h3>
                                {reward.locked ? (
                                    <span>
                                        <CiLock />
                                    </span>
                                ) : (
                                    <span>
                                        <CiUnlock />
                                    </span>
                                )}
                              </div>
                          </div>
                        )
                    })}
                </div>
            </div>
        </section>
        {form ? (
            <button onClick={handleCreateGoal} className="create-goal">Create Goal</button>
        ): (
            <button onClick={handleDeleteGoal} className="delete-goal">Delete Goal</button>
        )}
    </div>
  )
}


const MissionsPopup = ({missions, setMissions}: {
    missions: Mission[],
    setMissions: Dispatch<SetStateAction<Mission[]>>
}) => {
    const contentRef = useRef<HTMLTextAreaElement>(null);
    console.log(missions)
    return (
        <div className='missions-popup'>
            <textarea ref={contentRef} placeholder='Mission content' />
            <button onClick={() => {
                if (contentRef.current?.value && contentRef.current?.value.length > 0) {
                    setMissions([...missions, {content: contentRef.current?.value as string}]);
                }
                document.querySelector('.missions-popup')?.parentElement?.remove();
            }}>Done</button>
        </div>
    )
}

const SearchPopup = ({handleSearch, searchType, specified, setSpecified}: {
    handleSearch: (searchTerm: string) => Promise<Array<RelatedObj | Entertainment>>, 
    searchType: string,
    specified: Array<RelatedObj | Entertainment>,
    setSpecified: Dispatch<SetStateAction<Array<RelatedObj | Entertainment>>>
}) => {

    const [results, setResults] = useState<Array<unknown>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [temporarySpecified, setTemporarySpecified] = useState<Array<RelatedObj | Entertainment>>(specified);
    
    const searchRef = useRef<HTMLInputElement>(null);
    
    function handleSpecifyResult(e: MouseEvent<HTMLElement>, obj: RelatedObj | Entertainment) {
        const target = e.target as HTMLElement;
        
        if (target.classList.contains('specified')) {
            setTemporarySpecified(temporarySpecified.filter((item: RelatedObj | Entertainment) => item.id !== obj.id));
        } else {
            setTemporarySpecified([...temporarySpecified, obj]);
        }

        target.classList.toggle('specified');
    }


    return (
        <div className="search-popup">
            <div>
                <input onInput={async () => {
                    setLoading(true);
                    setResults(await handleSearch(searchRef.current?.value as string));
                    setLoading(false);
                }} ref={searchRef} type="text" placeholder='Type Project or Course Titles' />
                
                <button onClick={() => {
                    setSpecified(temporarySpecified);
                    document.querySelector('.search-popup')?.parentElement?.remove();
                }}>Done</button>
            </div>
            <div className={"search-results "+searchType}>
                {loading ? (
                    <FadeLoader />
                ): (
                    <>
                        {(searchType === 'projects' || searchType === 'courses') && (results as Array<RelatedObj>).map((result: RelatedObj) => {
                            return (
                                <div onClick={(e) => {handleSpecifyResult(e, result)}} key={result.id} className={`related-obj ${temporarySpecified.find(item => item.id === result.id) ? 'specified' : ''}`}>
                                    <h3>{result.title.length > 30 ? result.title.slice(0, 31)+'...' : result.title}</h3>
                                </div>
                            )
                        })}
                        {searchType === 'rewards' && (results as Array<Entertainment>).map(result => {
                            return (
                                <div className={`reward ${temporarySpecified.find(item => item.id === result.id) ? 'specified' : ''}`} onClick={(e) => {handleSpecifyResult(e, result)}} key={result.id}>
                                    <div className="img">
                                        <img src={result.image_upload || result.image} alt="" />
                                    </div>
                                    <span>
                                        {result.title.length > 15 ? result.title.slice(0, 16)+'...' : result.title}
                                    </span>
                                </div>
                            )
                        })}
                    </>
                )}
            </div>
            
        </div>
    )
}

export default GoalContainer;