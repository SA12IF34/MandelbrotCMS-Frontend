import React, {useContext, useEffect} from 'react';
import ToggleSetting from "./ToggleSetting";
import { AuthContext } from "../../../context/AuthContext";

import type { Settings as SettingsType } from '../../../types/types';

import { createApi, handleError } from '../api';
import { AxiosError } from 'axios';

const api = createApi(import.meta.env.VITE_API_BASE_URL+'authentication/')

type ContextType = { settings: SettingsType | undefined, setSettings: React.Dispatch<React.SetStateAction<SettingsType | undefined>> }

function Settings() {

  const {settings, setSettings} = useContext(AuthContext as React.Context<ContextType>) ;

  const enteratinmentTypeRef = React.useRef<HTMLSelectElement | null>(null)
  const [prevTypeVal, setPrevTypeVal] = React.useState<string>('');

  async function handleGetSettings() {
    try {
      if (localStorage.getItem('settings')) {
        setSettings(
          JSON.parse(localStorage.getItem('settings') as string) as SettingsType
        )

      } else {
        const response = await api.get('apis/settings/');

        if (response.status === 200) {
          const data = await response.data;
          localStorage.setItem('settings', JSON.stringify(data));
          console.log(data)

          setSettings(data as SettingsType);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        handleError(error);
      } else {
        alert('Something went wrong while fetching settings. Please try again later.');
        console.error(error);
      }

    }
  }

  async function handleUpdateSettings(data: object): Promise<boolean> {
    try {
      
      const response = await api.patch('apis/settings/', data);

      if (response.status === 202){
        const data = await response.data;
        localStorage.setItem('settings', JSON.stringify(data));
        setSettings(data as SettingsType);  
        console.log('data', data)
        return true;
      
      }

      return false;

    } catch (error) {
      handleError(error);
      return false;
    }
  }                                                                          

  useEffect(() => {
    handleGetSettings();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (settings) {
      setPrevTypeVal(settings.default_entertainment_type);
    }
  }, [settings]);

  return (
    <div className='settings-container'>
      <section className="settings-options">
        <h3>Options</h3>
        <br />
        <div>    
          {settings  && (<>
            <ToggleSetting 
              label={'Redirect to Central on Opening'}
              setting={'redirect_home'}
              value={settings.redirect_home}
              handleChange={handleUpdateSettings}
            />

            <ToggleSetting 
              label={'Navigate to Parts from Intro Page'}
              setting={'intro_parts_nav'}
              value={settings.intro_parts_nav}
              handleChange={handleUpdateSettings}
            />

            <div className="entertainment-type">
              <span>Entertainment Default Material Type: </span>
              <select value={prevTypeVal} ref={enteratinmentTypeRef} onChange={async () => {
                const newValue = enteratinmentTypeRef.current?.value;
                const prevValue = prevTypeVal;
                setPrevTypeVal(newValue as string);
                
                if (!(await handleUpdateSettings({ default_entertainment_type: newValue }))) {
                  // if update fails, revert to previous value
                  setPrevTypeVal(prevValue);
                }
              }} >
                <option value="anime&manga">Anime & Manga</option>
                <option value="shows&movies">Shows & Movies</option>
                <option value="game">Games</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>)}
        </div>
      </section>
    </div>
  )
}

export default Settings;