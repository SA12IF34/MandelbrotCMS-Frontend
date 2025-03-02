import { Link } from "react-router-dom"

function NotFound() {
  document.title = 'Not Found';
  return (
    <div className='page'>
      <h2>The page does not exist..</h2>
      <br />
      <Link to='/sessions-manager/'>
        Back to Home Page
      </Link>
    </div>
  )
}

export default NotFound