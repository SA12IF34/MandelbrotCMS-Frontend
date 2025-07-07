import {Link} from 'react-router-dom';

type props = {
    noteId: number,
    title: string | null | undefined,
    content: string,
    createDate: string
}

function NoteElement({noteId, title, content, createDate}: props) {
  return (
    <Link to={`/notes/${noteId}`} className='note-element'>
        <span>{createDate.split('T')[0]}</span>
        {title ? <h2>{title.length > 30 ? title.slice(0, 31)+'...' : title}</h2>
        :<h2>{content.length > 30 ? content.slice(0, 31)+'...': content}</h2>}
    </Link>
  )
}

export default NoteElement;