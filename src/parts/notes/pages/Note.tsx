import { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { MdOutlineClose } from 'react-icons/md'


import { AxiosError } from 'axios';
import { api, handleError } from '../api';
import type { Note as NoteType } from '../../../types/types';

import NoteHeader from '../components/NoteHeader';
import DrawCanvas from '../components/DrawCanvas';

import type { uploadedImage } from '../types';


function Note() {

  const { id } = useParams();
  const navigator = useNavigate();

  const [mode, setMode] = useState<'read' | 'create' | 'update'>('read');
  const [note, setNote] = useState<NoteType>();

  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>();
  const [draw, setDraw] = useState<boolean>(false);
  const [drawnContent, setDrawnContent] = useState<string | null>();
  const [uploadedImage, setUploadedImage] = useState<uploadedImage>();

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGetNote = async () => {
    try {
      const response = await api.get<NoteType>(`note/${id}/`);
      if (response.status === 200) {
        setNote(response.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          navigator('/notes/not-found');
        }
      }
      handleError(error);
    }
  }

  const handleUpdateNote = async () => {
    if (mode === 'update') {
      try {

        const data: Record<string, unknown> = {};

        data['title'] = titleRef.current?.value
        data['content'] = contentRef.current?.innerHTML
        data['drawn_content'] = drawnContent;
        if (uploadedImage && uploadedImage['file'] !== note?.uploaded_file) {
          data['uploaded_file'] = uploadedImage['file'];
          console.log(uploadedImage['file'])
        }

        console.log(data)

        const response = await api.patch(`note/${id}/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 202) {
          const data = await response.data;
          setNote(data);
          setMode('read');
        }
      } catch (error) {
        handleError(error);
      }
    }
  }



  useEffect(() => {
    handleGetNote();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (note) {
      document.title = note.title || 'Note';
    }
    setDrawnContent(note?.drawn_content);
    const img = new Image();
    img.src = import.meta.env.VITE_API_BASE_URL+note?.uploaded_file as string;
    
    const createFileFromUrl = async () => {
      if (note?.uploaded_file) {
        const imageUrl = import.meta.env.VITE_API_BASE_URL + note.uploaded_file;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], note.uploaded_file.split('/')[note.uploaded_file.split('/').length -1], { type: blob.type });
        
        setUploadedImage({
          dataUrl: imageUrl,
          file: file
        });
      }
    };

    createFileFromUrl();
    
    if (titleRef.current) {
      titleRef.current.value = note?.title || '';
    }
  }, [note, mode])


  return (
    <div className='page note-page'>
      {!note ? (
        <FadeLoader color="#98816c" height={18} width={6} />
      ): (
        <>
          <NoteHeader mode={mode} 
                      setMode={setMode} 
                      setDraw={setDraw}
                      setUploadedImage={setUploadedImage}
                      handleSubmit={handleUpdateNote} />
          <div>
            <div className={`note-container ${mode}`}>
                {mode === 'read' 
                ? (<h2 id='note-title'>{!note.title ? '' : note.title}</h2>) 
                : (<input ref={titleRef} type='text' id='note-title' />)}
                <div ref={contentRef} id='note-content' dangerouslySetInnerHTML={{__html: !note.content ? '' : note.content}} contentEditable={mode === 'update' ? 'true': 'false'} className="note-content">

                </div>
                {draw ? (
                  <DrawCanvas canvasHistory={canvasHistory as ImageData[]} 
                              setCanvasHistory={setCanvasHistory as Dispatch<SetStateAction<ImageData[]>>} 
                              setDraw={setDraw as Dispatch<SetStateAction<boolean>>} 
                              setDrawnContent={setDrawnContent as Dispatch<SetStateAction<string | undefined>>} 
                  />
                ): drawnContent && (
                  <div className="note-img-container drawn-content">
                    {mode === 'update' && 
                      <button onClick={() => {
                        setDrawnContent(null);
                      }}>
                        <MdOutlineClose />
                      </button>
                    }
                    <img src={drawnContent} alt="" />
                  </div>
                )}

                {uploadedImage && uploadedImage['file'] && (
                  <div className='note-img-container uploaded-img'>
                    {mode === 'update' &&
                      <button onClick={() => {
                        setUploadedImage({'file': null})
                      }}>
                        <MdOutlineClose />
                      </button>
                    }
                    <img src={uploadedImage['dataUrl']} alt="" />
                  </div>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Note;