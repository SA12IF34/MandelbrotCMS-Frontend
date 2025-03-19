import {useState, useEffect, useRef, useContext} from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { api, handleError } from '../api';
import { Entertainment } from '../../../types/types';

function Search() {
  document.title = 'Search';
  const {theme} = useContext(ThemeContext);

  const titleRef = useRef<HTMLInputElement | null>(null);
  const typeRef = useRef<HTMLSelectElement | null>(null);
  const subTypeRef = useRef<HTMLSelectElement | null>(null);
  const statusRef = useRef<HTMLSelectElement | null>(null);
  const specialRef = useRef<HTMLInputElement | null>(null);
  const rateRef = useRef<HTMLSelectElement | null>(null);
  const myRateRef = useRef<HTMLSelectElement | null>(null);

  const [searchResults, setSearchResults] = useState<Entertainment[]>();
  const [showGenres, setShowGenres] = useState<boolean>(false);
  const genres: string[] = ['action', 'adventure', 'ai', 'arts', 'cars', 'comedy', 'dementia',
    'demons', 'drama', 'ecchi', 'fantasy', 'sci-fi', 'game', 'harem',
    'hentai', 'historical', 'horror', 'josei', 'kids', 'magic',
    'martial', 'mecha', 'military', 'music', 'mystery', 'parody',
    'police', 'power', 'psychological', 'romance', 'samurai', 'school',
    'seinen', 'shoujo', 'shounen', 'space', 'sports',
    'super', 'supernatural', 'thriller', 'vampire', 'yaoi', 'yuri', 
    'cgdct', 'iyashikei', 'moe', 'slice of life'];

  async function handleSearch(searchQuery: string) {
    try {
      const response = await api.get(
        `search/?${searchQuery}`
      );

      if (response.status === 200) {
        const data = await response.data;
        setSearchResults(data);
      }

    } catch (error) {
      handleError(error);
      
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramKeys = Array.from(params.keys());
    const paramVals = Array.from(params.values());
    let searchQuery = '';
    
    for (let i=0; i < paramKeys.length; i++) {
      if (i === paramKeys.length-1) {
        if (paramKeys[i] === 'type') {
          searchQuery += `${paramKeys[i]}=${encodeURIComponent(paramVals[i]) || ''}`;
        } else {
        searchQuery += `${paramKeys[i]}=${paramVals[i] || ''}`;
        }
      }else {
        if (paramKeys[i] === 'type') {
          searchQuery += `${paramKeys[i]}=${encodeURIComponent(paramVals[i]) || ''}&`;
        } else {
        searchQuery += `${paramKeys[i]}=${paramVals[i] || ''}&`;
        }
      }
      const input = document.getElementById(paramKeys[i]) as HTMLInputElement;
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = paramVals[i] === 'true' ? true : false;
        } else {
          input.value = decodeURIComponent(paramVals[i]);
        }
      } 
    }
    handleSearch(searchQuery);

  // eslint-disable-next-line
  }, [])

  const handleChangeField = () => {
    const title = titleRef.current?.value;
    const type = typeRef.current?.value;
    const subType = subTypeRef.current?.value;
    const status = statusRef.current?.value;
    const special = specialRef.current?.checked;
    const rate = rateRef.current?.value;
    const myRate = myRateRef.current?.value;

    let genreFilters: NodeListOf<Element> | string[] | string = document.querySelectorAll(".genres input:checked");
    genreFilters = Array.from(genreFilters).map(genre => (genre as HTMLElement).id);
    genreFilters = genreFilters.length > 0 ? genreFilters.join(',') : '';

    // const searchQuery = `title=${title}&type=${encodeURIComponent(type as string)}&subtype=${subType}&status=${status}&special=${special}&rate=${rate}&user_rate=${myRate}`

    const params = new URLSearchParams(window.location.search);

    params.set('title', title || '');
    params.set('type', type || '');
    params.set('subtype', subType || '');
    params.set('status', status || '');
    params.set('special', special ? 'true' : 'false');
    params.set('rate', rate || '');
    params.set('user_rate', myRate || '');
    params.set('genres', genreFilters);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);

    handleSearch(params.toString());
  };

  return (
    <div className='search-page page'>
      <div className='fields-container'>
        <input id='title' onChange={handleChangeField} ref={titleRef} type="text" placeholder='Material Name' />
        <select id='type' onChange={handleChangeField} ref={typeRef}>
          <option selected value="">Type</option>
          <option value="anime&manga">Anime & Manga</option>
          <option value="shows&movies">Shows & Movies</option>
          <option value="game">Games</option>
          <option value="other">Other</option>
        </select>
        <select id='subtype' onChange={handleChangeField} ref={subTypeRef}>
          <option selected value="">Sub-type</option>
          <option value="anime">Anime</option>
          <option value="manga">Manga</option>
          <option value="show">Shows</option>
          <option value="movie">Movies</option>
          <option value="game">Games</option>
        </select>
        <select id='status' onChange={handleChangeField} ref={statusRef}>
          <option selected value="">Status</option>
          <option value="current">Current</option>
          <option value="done">Done</option>
          <option value="future">Future</option>
        </select>
        <label htmlFor="special" className={`specialty ${specialRef.current?.checked ? 'checked' : ''}`}>
          <span>Special</span>
          <input onChange={handleChangeField} ref={specialRef} type="checkbox" id="special" />
        </label>
        <select id='rate' onChange={handleChangeField} ref={rateRef}>
          <option selected value="">Avg rate</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        <select id='user_rate' onChange={handleChangeField} ref={myRateRef}>
          <option selected value="">My rate</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        <div className='genres'>
          <span onClick={() => {setShowGenres((show) => !show)}} >genres</span>
          <div className={`genres-container ${showGenres ? 'show': ''}`}>
            {genres.map(genre => {
              return (
                <label key={genre} htmlFor={genre} className='genre'>
                  <input onChange={handleChangeField} type="checkbox" id={genre} />
                  <span>{genre === 'cgdct' ? genre.toUpperCase() : genre.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                </label>
              )
            })}
          </div>
        </div>
      </div>
      <div className="results-container">
          {!searchResults ? (
            <FadeLoader color={theme === 'light' ?' #350d0b' : '#f5f5f5'} height={18} width={6} />
          ): searchResults.length > 0 ? searchResults.map(material => {
            return (
              <Link title={material.title} key={material.id} to={`/entertainment/materials/${material.id}`}>
                <div>
                  <div className='img-container'>
                    <img src={material.image} alt="" />
                  </div>
                  <div className="title">
                    <span>{material.title.length > 35 ? material.title.slice(0, 36)+'...' : material.title}</span>
                  </div>
                </div>
              </Link>
            )
          }) : (
            <h2>No materials..</h2>
          )}
      </div>
    </div>
  )
}

export default Search;