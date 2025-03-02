import {useState, useEffect, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { IoClose, IoCheckmark } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { AxiosError } from 'axios';
import {api, handleError} from '../api';
import type { Project } from '../../../types/types';


function Project() {
  const [project, setProject] = useState<Project>();
  const [editStartDate, setEditStartDate] = useState<boolean>(false);
  const [editFinishDate, setEditFinishDate] = useState<boolean>(false);
  const startDateRef = useRef<HTMLInputElement>(null);
  const finishDateRef = useRef<HTMLInputElement>(null);
  const {id} = useParams();
  const navigator = useNavigate();

  async function handleGetProjectData() {
    try {
      const response = await api.get(`projects/${id}/`);

      if (response.status === 200) {
        const data = await response.data;
        document.title = data['title']
        setProject(data);
      }

    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 404) {
          navigator('/sessions-manager/not-found/');
        }
        else {
          handleError(error)
        }
      }
    }
  }

  async function handleUpdateProject(data: object) {
    try {
      const response = await api.patch(`projects/${id}/`, data);

      if (response.status === 202) {
        handleGetProjectData();
      }

    } catch (error) {
      handleError(error);
    }
  }

  async function handleDeleteProject() {
    try {
      const response = await api.delete(`projects/${id}/`);

      if (response.status === 204) {
        navigator('/sessions-manager/');
      }

    } catch (error) {
      handleError(error);
    }
  }

  async function handleRemovePartition(partitionID: number) {
    try {
      let confirmDel = true;
      if (project?.partitions?.length === 1) {
        if (!confirm('Deleting the last partition will delete the whole project.')) {
          confirmDel = false
        }
      }
      if (confirmDel) {
        const response = await api.delete(`partitions/${partitionID}/`);

        if (response.status === 202) {
          handleGetProjectData();
        } else if (response.status === 204) {
          handleDeleteProject();
        }
      }

    } catch (error) {
      handleError(error);
    }
  }

  async function handleCompletePartition(partitionID: number) {
    try {
      const response = await api.patch(`partitions/${partitionID}/`, {done: true});

      if (response.status === 202) {
        handleGetProjectData();
      } else if (response.status === 200) {
        window.location.reload();
      }

    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    handleGetProjectData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className='page project-page'>
      {!project ? (
        <FadeLoader color='#808080' height={18} width={6} />
      ) : (
        <>
          <div className="info">
            <h2>{project.title}</h2>
            <br />
            <p>{project.description}</p>
          </div>
          <div className="dates">
            <div>
              <h3>
                Start Date: 
              </h3>
              {editStartDate ? (
                <input onChange={() => {
                  if (startDateRef.current?.value) {
                    handleUpdateProject({start_date: startDateRef.current.value});
                    setEditStartDate(false);
                  }
                }} ref={startDateRef} type="date" name="" id="" />
              ) : (
                <>
                  <h3>
                  &nbsp;&nbsp;{project.start_date ? project.start_date : (<span style={{fontStyle: 'italic'}}>Indertermined</span>)}
                  </h3>
                  &nbsp;&nbsp;
                  <button className='prepare-btn' onClick={() => {setEditStartDate(true)}}>
                    <CiEdit />
                  </button>
                </>
              )}
            </div>
            <div>
              <h3>
                Finish Date: 
              </h3>
              {editFinishDate ? (
                <input onChange={() => {
                  if (finishDateRef.current?.value) {
                    handleUpdateProject({finish_date: finishDateRef.current.value});
                    setEditFinishDate(false);
                  }
                }} ref={finishDateRef} type="date" />
              ): (
                <>
                  <h3>
                  &nbsp;&nbsp;{project.finish_date ? project.finish_date : (<span style={{fontStyle: 'italic'}}>Indetermined</span>)}
                  </h3>
                  &nbsp;&nbsp;
                  <button className='prepare-btn' onClick={() => {setEditFinishDate(true)}}>
                    <CiEdit />
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="partitions">
            <h2>Partitions</h2>
            <br />
            <div className="partitions-container">
              {project.partitions?.map(partition => {
                return (
                  <div className={`partition ${partition.done && 'done'}`}>
                    <h3>{partition.title}</h3>
                    {partition.description && (<>
                      <br />
                      <p>{partition.description}</p>
                    </>)}
                    {!partition.done && (
                      <button onClick={() => {handleCompletePartition(partition.id)}} title='complete partition' className='complete-partition prepare-btn'>
                        <IoCheckmark />
                      </button>
                    )}
                    <button onClick={() => {handleRemovePartition(partition.id)}} title='remove partition' className='remove-partition prepare-btn'>
                      <IoClose />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
          <button onClick={handleDeleteProject} title='delete project' className="delete-project">
            Delete Project
          </button>
        </>
      )}
    </div>
  )
}

export default Project