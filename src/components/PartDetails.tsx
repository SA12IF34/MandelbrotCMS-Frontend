import {IoClose} from 'react-icons/io5';

interface props {
    name: string,
    description: string,
    setShowPartDetails: (show: boolean) => void
}

function PartDetails({name, description, setShowPartDetails}: props) {
  return (
    <div className='part-details-container'>
      <div></div>
      <div>
        <h1>
          {name}
        </h1>
        <p>
          {description}
        </p>
      </div>
      <div></div>
      <button onClick={() => {
        setShowPartDetails(false);
      }} className="close-details">
        <IoClose/>
      </button>
    </div>
  )
}

export default PartDetails