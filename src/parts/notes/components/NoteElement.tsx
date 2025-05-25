import {Link} from 'react-router-dom';

type props = {
    noteId: number,
    title: string,
    createDate: string
}

function NoteElement({noteId, title, createDate}: props) {
  return (
    <Link to={`/notes/${noteId}`} className='note-element'>
        <span>{createDate}</span>
        <h2>{title}</h2>
    </Link>
  )
}

export default NoteElement;