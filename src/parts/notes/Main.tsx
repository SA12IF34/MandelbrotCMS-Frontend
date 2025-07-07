import {lazy} from 'react';
import {
    Routes,
    Route
} from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import Layout from './Layout';

const Home = lazy(() => import('./pages/Home'));
const NewNote = lazy(() => import('./pages/NewNote'));
const Note = lazy(() => import('./pages/Note'));

import './Style.css';
import '../../styles/index.css'


function Notes() {
  
  const style = {
    layout: 'n-layout',
    nav: 'n-nav',
    c1: '#f5f5f5',
    c2: '#E0BEA2',
    c3: '#BCA38D'
  }


  return (
    <MainLayout style={style}>
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/new-note" element={<NewNote />} />
                <Route path="/:id" element={<Note />} />
            </Routes>
        </Layout>
    </MainLayout>
  )
}

export default Notes;