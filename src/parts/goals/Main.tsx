import {lazy} from 'react';
import {Routes, Route} from 'react-router-dom';

import MainLayout from '../../components/MainLayout';
import Layout from './Layout';

import './Style.css'
import '../../styles/index.css'

const Home = lazy(() => import('./pages/Home'));
const CreateGoal = lazy(() => import('./pages/CreateGoal'));
const Goal = lazy(() => import('./pages/Goal'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Main() {

  const style = {
    layout: 'goals-layout',
    nav: 'goals-nav',
    c1: '#F5F5F5',
    c2: '#C0C0C0',
    c3: '#000000'
  }

  return (
    <MainLayout style={style}>
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-goal" element={<CreateGoal />} />
                <Route path="/goal/:id" element={<Goal />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </Layout>
    </MainLayout>
  )
}

export default Main;