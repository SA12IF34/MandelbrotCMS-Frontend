import React from 'react';
import { IoClose } from "react-icons/io5";

function ContentPopup({children}: {children: React.ReactNode}) {
  return (
    <div className='content-popup'>
        <button onClick={(e) => {
          (e.target as HTMLElement).parentElement?.parentElement?.remove();
          window.location.hash = '';
        }}>
          <IoClose />
        </button>
        {children}
    </div>
  )
}

export default ContentPopup