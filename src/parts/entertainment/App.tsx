import {lazy, useContext} from 'react';
import {Routes, Route} from 'react-router-dom';
import './Style.css';

import { ThemeContext } from './context/ThemeContext';
import MainLayout from '../../components/MainLayout';
import Layout from './Layout';

const Home = lazy(() => import('./pages/Home'));
const AddMaterial = lazy(() => import('./pages/AddMaterial'));
const Material = lazy(() => import('./pages/Material'));
const Special = lazy(() => import('./pages/Special'));
const Search = lazy(() => import('./pages/Search'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {

  const {theme} = useContext(ThemeContext);

  const light = {
    layout: 'entertainment-layout-l',
    nav: 'entertainment-nav',
    c1: '#F5F5F5',
    c2: '#421C1A',
    c3: '#350D0B'
  };

  const dark = {
    layout: 'entertainment-layout-d',
    nav: 'entertainment-nav',
    c1: '#350D0B',
    c2: '#421C1A',
    c3: '#F5F5F5'
  };


  return (
    <MainLayout style={theme === 'light' ? light : dark}>
        <Layout>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/add-material/' element={<AddMaterial />} />
                <Route path='/materials/:id' element={<Material />} />
                <Route path='/special' element={<Special />} />
                <Route path='/search' element={<Search />} />
                <Route path='/*' element={<NotFound />} />
            </Routes>
        </Layout>
    </MainLayout>
  )
}

export default App;