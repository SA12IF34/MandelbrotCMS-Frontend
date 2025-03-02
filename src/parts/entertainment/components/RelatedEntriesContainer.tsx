import {useContext} from 'react';
import {ThemeContext} from '../context/ThemeContext';
import {FadeLoader} from 'react-spinners';
import { Entertainment } from '../../../types/types';

function RelatedEntriesContainer({materials}: {materials: Entertainment[] | undefined}) {
  const {theme} = useContext(ThemeContext);
  
  return (
    <div className='entries-container'>
      {!materials ? (
        <FadeLoader color={theme === 'light' ? '#350d0b' : '#f5f5f5'} />
      ): materials.map((material: Entertainment) => {
        return (
          <a href={`/entertainment/materials/${material.id}`} key={material.id} className='entry'>
            <div className="related-entry">
              <div className="img-container">
                <img src={material.image_upload || material.image} alt="" />
              </div>
              <div className="title">
                <span>{material.title && material.title.length > 35 ? material.title.slice(0,36): material.title}</span>
              </div>
            </div>
          </a>
        )
      })}
    </div>
  )
}

export default RelatedEntriesContainer;