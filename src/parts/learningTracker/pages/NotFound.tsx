import { Link } from "react-router-dom";

function NotFound() {
  document.title = 'Not Found';
  return (
    <div className='page'>
        <h2>The Page Does Not Exist..</h2>
        <br />
        <Link className="not-found-link" to='/learning-tracker'>Back Home Page</Link>
    </div>
  )
}

export default NotFound;