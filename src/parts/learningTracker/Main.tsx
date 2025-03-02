import React from 'react';
import {Routes, Route} from 'react-router-dom';

import './Style.css';
import '../../styles/index.css'

import MainLayout from '../../components/MainLayout';
import Layout from './Layout';

const Home = React.lazy(() => import('./pages/Home'));
const AddNew = React.lazy(() => import('./pages/AddNew'));
const Course = React.lazy(() => import('./pages/Course'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function Main() {

  const style = {
    layout: 'lr-layout',
    nav: 'lr-nav',
    c1: '#F5F5F5',
    c2: '#C0C0C0',
    c3: '#86AED2'
  }

  return (
    <MainLayout style={style}>
        <Layout>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/add-new' element={<AddNew />} />
                <Route path='/courses/:id' element={<Course />} />
                <Route path='/*' element={<NotFound />} />
            </Routes>
        </Layout>
    </MainLayout>
  )
}

export default Main;