import { useRef, useState } from 'react';
import { api, handleError } from '../api';
import { useNavigate } from 'react-router-dom';

function AddMaterial() {
  document.title = 'Add Material';
  const navigator = useNavigate();

  const linkRef = useRef<HTMLInputElement | null>(null);
  const statusRef = useRef<HTMLSelectElement | null>(null);

  const statusRef2 = useRef<HTMLSelectElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const subTypeRef = useRef<HTMLSelectElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef2 = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [imageUpload, setImageUpload] = useState<string>();
  const [imageURL, setImageURL] = useState<string>();

  async function handleAddByLink() {
    try {

      if (!linkRef.current?.value) {
        alert('Link is required');
        return;
      }
      if (!statusRef.current?.value) {
        alert('Status is required');
        return;
      }

      const response = await api.post('add/by-link/', {
        link: linkRef.current?.value,
        status: statusRef.current?.value
      })

      if (response.status === 201) {
        const data = await response.data;

        navigator(`/entertainment/materials/${data.id}/`);
      }

    } catch (error) {
      handleError(error);
    }
  }

  async function handleAddManually() {
    try {
      const data = {
        title: titleRef.current?.value,
        description: descriptionRef.current?.value,
        status: statusRef2.current?.value,
        link: linkRef2.current?.value,
        image: imageURL ? imageURL : null,
        image_upload: imageUpload ? imageUpload : null,
        type: typeRef.current?.value,
        sub_type: subTypeRef.current?.value
      }

      const response = await api.post(`add/manual/`, data);

      if (response.status === 201) {
        const data = await response.data;

        navigator(`/entertainment/materials/${data.id}/`);
      }


    } catch (error) {
      handleError(error);
    }
  }

  function handleGetImage(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;

    if (target.type === 'file') {
      const file = target.files?.[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const result = e.target?.result;

          if (typeof result === 'string') {
            setImageUpload(result);
          }
        }

        reader.readAsDataURL(file);
      }
    } else if (target.type === 'text') {
      setImageURL(target.value);
    }

  }

  return (
    <div className='page add-material-page'>
      <div className="by-link">
        <h2>Add Material by Link</h2>
        <div className="field-container">
          <input ref={linkRef} type="text" placeholder='Enter MAL, anilist, steam, or rotten tomatoes link' />
          <select ref={statusRef} defaultValue={''}>
            <option value="">Status</option>
            <option value="current">Current</option>
            <option value="done">Done</option>
            <option value="future">Future</option>
          </select>
        </div>
        <button onClick={handleAddByLink}>Add Material</button>
      </div>
      <div className="manual">
        <h2>Add Material Manually</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddManually();
        }}>
          <select ref={typeRef} title='required' required defaultValue={''}>
            <option value="">Type</option>
            <option value="anime&manga">Anime & Manga</option>
            <option value="shows&movies">Shows & Movies</option>
            <option value="game">Games</option>
            <option value="other">Other</option>
          </select>
          <select ref={subTypeRef} title='not required' defaultValue={''}>
            <option value="">Sub-type</option>
            <option value="anime">Anime</option>
            <option value="manga">Manga</option>
            <option value="show">Show</option>
            <option value="movie">Movie</option>
            <option value="game">game</option>
          </select>
          <select ref={statusRef2} required title='required' defaultValue={''}>
            <option value="">Status</option>
            <option value="current">Current</option>
            <option value="done">Done</option>
            <option value="future">Future</option>
          </select>
          <input ref={titleRef} required title='required' className='title' type="text" placeholder='Title' />
          <input ref={linkRef2} required title='required' className='link' type="text" placeholder='Link to the Work' />
          <input ref={imageRef} onChange={handleGetImage} className='image-link' type="text" placeholder='Image Link' />
          <label htmlFor="image-upload">
            <span className='image-upload-label'>Or Upload Image</span>
            <input onChange={handleGetImage} type="file" accept='image/jpeg,image/jpg,image/png,image/webp' id='image-upload'/>
          </label>
          {(imageUpload || imageURL) && (
            <img src={imageUpload || imageURL} alt="" />
          )}
          <textarea ref={descriptionRef} required title='required' placeholder='Description'></textarea>
          <button type='submit'>Add Material</button>
        </form>
      </div>
    </div>
  )
}

export default AddMaterial