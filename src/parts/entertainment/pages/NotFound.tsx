import { Link } from "react-router-dom";

function NotFound() {
  document.title = 'Not Found';
  return (
    <div className='not-found-page'>
      <h2>The Page Does Not Exist..</h2>
      <br />
      <Link className="not-found-link" to='/entertainment'>Back Home Page</Link>
    </div>
  )
}

export default NotFound