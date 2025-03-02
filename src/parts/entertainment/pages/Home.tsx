import { useState, useEffect} from 'react';
import { api, handleError } from '../api';
import { Entertainment } from '../../../types/types';

import MaterialsContainer from '../components/MaterialsContainer';
import Seperator from '../components/Seperator';


interface Materials {
  'anime&manga': Array<Entertainment>,
  'shows&movies': Array<Entertainment>,
  'game': Array<Entertainment>,
  'other': Array<Entertainment>,
}

function Home() {
  document.title = 'Entertainment - Home';
  const [currentMaterials, setCurrentMaterials] = useState<Materials>();
  const [doneMaterials, setDoneMaterials] = useState<Materials>();
  const [futureMaterials, setFutureMaterials] = useState<Materials>();

  async function handleGetAllMaterials() {
    try {
      const response = await api.get('all/');

      if (response.status === 200) {
        const data = await response.data;

        setCurrentMaterials(data['current']);
        setDoneMaterials(data['done']);
        setFutureMaterials(data['future']);
      }

    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    handleGetAllMaterials();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='home-page page'>
      <section>
        <h2>Current Materials</h2>
        <MaterialsContainer status='current' materials={currentMaterials} />
      </section>
      <Seperator />
      <section>
        <h2>Done Materials</h2>
        <MaterialsContainer status='done' materials={doneMaterials} />
      </section>
      <Seperator />
      <section>
        <h2>Future Materials</h2>
        <MaterialsContainer status='future' materials={futureMaterials} />
      </section>
      <Seperator />
    </div>
  )
}

export default Home;