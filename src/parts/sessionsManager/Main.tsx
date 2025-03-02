import {lazy} from 'react';
import {
    Routes,
    Route
} from 'react-router-dom';

import MainLayout from '../../components/MainLayout';
import Layout from './Layout';

const Home = lazy(() => import('./pages/Home'));
const Completed = lazy(() => import('./pages/Completed'));
const InProgress = lazy(() => import('./pages/InProgress'));
const NewProject = lazy(() => import('./pages/NewProject'));
const Project = lazy(() => import('./pages/Project'));
const NotFound = lazy(() => import('./pages/NotFound'));

import './Style.css';
import '../../styles/index.css'

export default function SessionsManager() {

    const style = {
        layout: 'sm-layout',
        nav: 'sm-nav',
        c1: '#f5f5f5',
        c2: '#808080',
        c3: '#808080'
    }

    return (
        <MainLayout style={style}>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/completed" element={<Completed />} />
                    <Route path="/in-progress" element={<InProgress />} />
                    <Route path="/new-project" element={<NewProject />} />
                    <Route path="/projects/:id" element={<Project />} />
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </Layout>
        </MainLayout>
    )
}