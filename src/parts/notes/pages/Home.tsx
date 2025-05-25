import {useEffect, useState} from 'react';
import { FadeLoader } from 'react-spinners';

import NoteElement from '../components/NoteElement';

import { api, handleError } from '../api';
import type { Note } from '../../../types/types';

function Home() {
  
  const [notes, setNotes] = useState<Array<Note>>();

  const handleGetNotes = async () => {
    try { 
      const response = await api.get('notes/');
      
      if (response.status === 200) {
        setNotes(response.data);
      }
    
    } catch (error) {
      handleError(error);
    
    }
  }

  useEffect(() => {
    document.title = 'Notes';
    handleGetNotes();
  }, []);


  return (
    <div className='page home-page'>
      <div className="notes-container">
        {notes ? notes.length > 0 ? notes.map((note) => (
          <NoteElement 
            key={note.id} 
            noteId={note.id} 
            title={note.title as string} 
            createDate={note.create_date} 
          />
        )) 
        : <h2 className='no-notes'>You did not create notes yet</h2> 
        : <FadeLoader color='#98816c' height={18} width={6} />
        }
      </div>
    </div>
  )
}
 
export default Home