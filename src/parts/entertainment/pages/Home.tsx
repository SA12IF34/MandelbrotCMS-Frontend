import { useState, useEffect, useContext} from 'react';
import { api, handleError } from '../api';
import { createApi } from '../../../api';
import { Entertainment } from '../../../types/types';

import { AuthContext, type AuthContextType } from '../../../context/AuthContext';

import MaterialsContainer from '../components/MaterialsContainer';
import Seperator from '../components/Seperator';

type ActiveType = 'anime&manga'
                  | 'shows&movies'
                  | 'game'
                  | 'other';

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
  const [defaultType, setDefaultType] = useState<ActiveType>();
  const {settings, setSettings} = useContext<AuthContextType>(AuthContext);


  async function handleRetrieveSettings() {
    try {
      const response = await createApi(import.meta.env.VITE_API_BASE_URL+'authentication/apis/').get('settings/');

      if (response.status === 200) {
        const data = await response.data;

        if (setSettings) {
          setSettings(data);
          localStorage.setItem('settings', JSON.stringify(data));
        }
      }
      
    } catch (error) {
      handleError(error);
    }
  }

  function handleGetSettings() {
    if (settings) {
      return;
    } else if (localStorage.getItem('settings')) {
      setSettings && setSettings(JSON.parse(localStorage.getItem('settings') as string));
    } else {
      handleRetrieveSettings();
    }

    return;
  }

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
    handleGetSettings()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (settings) {
      setDefaultType(settings.default_entertainment_type as ActiveType);
    }
  }, [settings])
 
  return (
    <div className='home-page page'>
      <section>
        <h2>Current Materials</h2>
        <MaterialsContainer status='current' materials={currentMaterials} currentActive={defaultType || 'anime&manga'} />
      </section>
      <Seperator />
      <section>
        <h2>Done Materials</h2>
        <MaterialsContainer status='done' materials={doneMaterials} currentActive={defaultType || 'anime&manga'} />
      </section>
      <Seperator />
      <section>
        <h2>Future Materials</h2>
        <MaterialsContainer status='future' materials={futureMaterials} currentActive={defaultType || 'anime&manga'} />
      </section>
      <Seperator />
    </div>
  )
}

export default Home;