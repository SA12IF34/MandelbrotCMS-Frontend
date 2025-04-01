import React from 'react';
import { PopupContext } from '../context/PopupContext';
import { IoClose } from "react-icons/io5";

function ContentPopup({children}: {children: React.ReactNode}) {

  const {setShowPopup} = React.useContext(PopupContext);

  return (
    <div className='content-popup'>
        <button onClick={() => {
          setShowPopup(false);
          window.location.hash = '';
        }}>
          <IoClose />
        </button>
        {children}
    </div>
  )
}

export default ContentPopup