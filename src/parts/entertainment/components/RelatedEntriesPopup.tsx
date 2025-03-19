import {useState, useRef} from 'react'
import { AxiosInstance } from 'axios';
import { Entertainment } from '../../../types/types';
import { handleError } from '../api';

interface props {
    api: AxiosInstance,
    handleAddRelatedEntries: (entries: Entertainment[]) => Promise<void>,
    handleClose: () => void
}

function RelatedEntriesPopup({api, handleAddRelatedEntries, handleClose}: props) {

  const [results, setResults] = useState<Entertainment[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<Entertainment[]>([]);

  async function handleSearch() {
    if (searchRef.current?.value.length === 0) {
        setResults([]);
        return;
    }

    try {
        const response = await api.get(`search/?title=${searchRef.current?.value}`);

        if (response.status === 200) {
            const data = await response.data;

            setResults(data);
        }

    } catch (error) {
        handleError(error)
    }
  }

  return (
    <div className='related-entries-popup'>
        <div>
            <input onInput={handleSearch} ref={searchRef} type="text" placeholder='Search...' />
        </div>
        <div>
            {results.length > 0 && results.map(result => {
                return (
                    <div>
                        <div>
                        <img src={result.image_upload || result.image} />
                        </div>
                        <h6>{result.title.length > 25 ? result.title.slice(0, 26)+'...' : result.title}</h6>
                        <button onClick={(e) => {
                            const ele = (e.target as HTMLElement).parentElement?.parentElement;
                            ele?.classList.toggle('selected');

                            if (selected.includes(result)) {
                                setSelected(selected.filter(s => s.id !== result.id))
                            } else {
                                setSelected(s => [...s, result]);
                            }
                        }}>
                            {selected.includes(result) ? 'unselect': 'select'}
                        </button>
                    </div>
                )
            })}
        </div>
        <div>
            <button onClick={() => {
                if (selected.length > 0) {
                    handleAddRelatedEntries(selected);
                } else {
                    alert("Please select related entries befor adding");
                }
            }}>
                Add selected
            </button>
            <button onClick={handleClose}>Close</button>
        </div>
    </div>
  )
}

export default RelatedEntriesPopup;