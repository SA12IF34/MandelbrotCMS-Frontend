import {useEffect, useState, useRef} from 'react';

import NoteHeader from "../components/NoteHeader";
import DrawCanvas from '../components/DrawCanvas';

import { api, handleError } from '../api';

import type { uploadedImage } from '../types';

interface submitData {
  title?: string,
  content?: string,
  drawn_content?: string,
  uploaded_file?: File | null
}

function NewNote() {

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [draw, setDraw] = useState<boolean>(false);
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const [uploadedImage, setUploadedImage] = useState<uploadedImage>();
  const [drawnContent, setDrawnContent] = useState<string>();

  useEffect(() => {
    document.title = 'New Note';
  }, [])

  async function handleCreateNote() {
    try {
      const data: submitData = {};
      if (titleRef.current && titleRef.current.value.length > 0) {
        data['title'] = titleRef.current.value;
      }

      if (contentRef.current && ((contentRef.current.textContent?.length ?? 0) > 0)) {
        data['content'] = contentRef.current.innerHTML
      } else if ((contentRef.current?.textContent?.length ?? 0) === 0) {
        alert('The note must have at least a content')
      }

      if (drawnContent) {
        data['drawn_content'] = drawnContent;
      }

      if (uploadedImage) {
        data['uploaded_file'] = uploadedImage['file'];
      }

      const response = await api.post('notes/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        const data = await response.data;

        location.assign(`/notes/${data['id']}/`);
      }

    } catch (error) {
      handleError(error);
    }
  }

  return (
    <div className='new-note-page page'>
      <NoteHeader 
                  setUploadedImage={setUploadedImage} 
                  mode='create' 
                  draw={draw} 
                  setDraw={setDraw} 
                  setMode={undefined} 
                  handleSubmit={handleCreateNote} />
      <div>
        <div className="note-container">
          <input ref={titleRef} type="text" id="note-title" placeholder='Note Title'/>
          <div ref={contentRef} contentEditable id='note-content'>
          </div>
          {draw && (
            <DrawCanvas canvasHistory={canvasHistory} setCanvasHistory={setCanvasHistory} setDraw={setDraw} setDrawnContent={setDrawnContent} />
          )}
          {drawnContent && (
            <div className="note-img-container">
              <img src={drawnContent} alt="" />
            </div>
          )}
          {uploadedImage && (
            <div className='note-img-container'>
              <img src={uploadedImage['dataUrl'] as string} alt="" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewNote