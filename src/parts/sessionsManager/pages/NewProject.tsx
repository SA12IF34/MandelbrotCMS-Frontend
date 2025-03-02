import {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import {api, handleError} from '../api';
import { IoClose } from 'react-icons/io5';

function NewProject() {
  document.title = 'New Project';
  const [partitions, setPartitions] = useState<Array<{title: string, description?: string }>>([]);
  const [addPartition, setAddPartition] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const startDateRef = useRef<HTMLInputElement | null>(null);
  const finishDateRef = useRef<HTMLInputElement | null>(null);

  const navigator = useNavigate();

  async function handleAddProject() {
    try {
      const startDate = (startDateRef.current?.value as string).length > 0 ? startDateRef.current?.value : null;
      const finishDate = (finishDateRef.current?.value as string).length > 0 ? finishDateRef.current?.value : null;

      const data = {
        project: {
          title: titleRef.current?.value,
          description: descriptionRef.current?.value,
          start_date: startDate,
          finish_date: finishDate
        },
        partitions: partitions
      };

      const response = await api.post('projects/', data);

      if (response.status === 201) {
        const data = await response.data;
        
        navigator(`/sessions-manager/projects/${data.id}`);
      }

    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div className='page new-project-page'>
      <form onSubmit={(e) => {e.preventDefault()}}>
        <section className="info">
          <div>
            <label htmlFor="title" className='important'>Project Title</label>
            <input ref={titleRef} required type="text" name="title" id="title"  />
          </div>
          <br />
          <div>
            <label htmlFor="desc" className='important'>Project Description</label>
            <textarea ref={descriptionRef} required name="desc" id="desc" ></textarea>
          </div>
        </section>
        <section className="partitions">
          <div className="label">
            <h2>Partitions</h2>
            <button title='add partition' onClick={() => {setAddPartition(true)}} className='prepare-btn'>
              {<LuPlus />}
            </button>
          </div>
          <div className='partitions-container'>
            {partitions.map(partition => {
              return (
                <div className={`partition`}>
                  <h3>{partition.title}</h3>
                  {partition.description && (<>
                    <br />
                    <p>{partition.description}</p>
                  </>)}
                  
                  <button onClick={() => {setPartitions(partitions.filter(p => p.title !== partition.title))}} title='remove partition' className='remove-partition prepare-btn'>
                    <IoClose />
                  </button>
                </div>
              )
            })}
          </div>
          {addPartition && (
            <div className='partition-form'>
              <div>
                <input type="text" placeholder='title' />
                <textarea placeholder='description'></textarea>
              </div>
              <div>
                <button onClick={(e) => {
                  const input = (e.target as HTMLElement).parentElement?.parentElement?.querySelector('input');
                  const textarea = (e.target as HTMLElement).parentElement?.parentElement?.querySelector('textarea');
                  
                  if (input?.value.length === 0) {
                    alert('Partition must have at least a title.');
                    return;
                  }

                  setPartitions([...partitions, {title: input?.value as string, description: textarea?.value}])
                  
                  if (input && textarea) {
                    input.value = '';
                    textarea.value = '';
                  }

                  setAddPartition(false)
                }}>Add</button>
                <button onClick={(e) => {
                  const input = (e.target as HTMLElement).parentElement?.parentElement?.querySelector('input');
                  const textarea = (e.target as HTMLElement).parentElement?.parentElement?.querySelector('textarea');
                  
                  if (input && textarea) {
                    input.value = '';
                    textarea.value = '';
                  }

                  setAddPartition(false)}
                }>Cancel</button>
              </div>
            </div>
          )}
        </section>
        <section className="dates">
          <div>
            <label htmlFor="s-date">Start Date</label>
            <input ref={startDateRef} type="date" name="s-date" id="s-date" />
          </div>
          <div>
            <label htmlFor="f-date">Finish Date</label>
            <input ref={finishDateRef} type="date" name="f-date" id="f-date" />
          </div>
        </section>
        <button onClick={handleAddProject} type="submit" title='add project' className='add-project'>Add Project</button>
      </form>
    </div>
  )
}

export default NewProject;