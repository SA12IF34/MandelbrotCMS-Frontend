import React from 'react';
import {
    Routes,
    Route
} from 'react-router-dom';
import './Style.css';
import '../../styles/index.css'


import { ContextProvider } from './context/PopupContext';
import MainLayout from '../../components/MainLayout';
import Layout from './Layout';

const Home = React.lazy(() => import('./pages/Home'));
const CreateNewList = React.lazy(() => import('./pages/CreateNewList'));
const AllLists = React.lazy(() => import('./pages/AllLists'));
const List = React.lazy(() => import('./pages/List'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

export default function TheCentral() {


    const style = {
        layout: 'central-layout',
        nav: 'central-nav',
        c1: '#F5F5F5',
        c2: '#C0C0C0',
        c3: '#434343'
    }

    return (
    <ContextProvider>
        <MainLayout style={style}>
            <Layout>
                <Routes>
                    <Route path='/' element={<Home title={'The Central'} />} />
                    <Route path='/create-new-list' element={<CreateNewList title={'New List'} />} />
                    <Route path='/all-lists' element={<AllLists title={'All Lists'} />} />
                    <Route path='/lists/:id' element={<List />} />
                    <Route path='/profile' element={<ProfilePage title={'Profile'} />} />
                    <Route path='/settings' element={<SettingsPage title={'Settings'} />} />
                    <Route path='/*' element={<NotFound />} />
                </Routes>
            </Layout>
            
        </MainLayout>
    </ContextProvider>
    )
}