import {useState, useEffect} from 'react';
import {api, handleError} from '../api';
import { Entertainment } from '../../../types/types';

import MaterialsContainer from '../components/MaterialsContainer';
import Seperator from '../components/Seperator';

function Special() {
  document.title = 'Entertainment - Special';
  const [animeAndManga, setAnimeAndManga] = useState<Entertainment[]>();
  const [showsAndMovies, setShowsAndMovies] = useState<Entertainment[]>();
  const [games, setGames] = useState<Entertainment[]>();
  const [other, setOther] = useState<Entertainment[]>();


  async function handleGetMaterials() {
    try {
      const response = await api.get('special/');

      if (response.status === 200) {
        const data = await response.data;

        setAnimeAndManga(data['anime&manga']);
        setShowsAndMovies(data['shows&movies']);
        setGames(data['game']);
        setOther(data['other']);
      }

    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    handleGetMaterials();
    // eslint-disable-next-line 
  }, [])

  return (
    <div className='page special-page'>
      <section>
        <h2>Anime & Manga</h2>
        <MaterialsContainer currentActive='anime&manga' one={true} materials={animeAndManga} />
      </section>
      <Seperator />
      <section>
        <h2>Shows & Movies</h2>
        <MaterialsContainer currentActive='shows&movies' one={true} materials={showsAndMovies}/>
      </section>
      <Seperator />
      <section>
        <h2>Games</h2>
        <MaterialsContainer currentActive='game' one={true} materials={games}/>
      </section>
      <Seperator />
      <section>
        <h2>Other</h2>
        <MaterialsContainer currentActive='other' one={true} materials={other}/>
      </section>
    </div>
  )
}

export default Special;