import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const Intro = React.lazy(() => import('./pages/Intro'));

const TheCentral = React.lazy(() => import('./parts/central/Main'));
const SessionsManager = React.lazy(() => import('./parts/sessionsManager/Main'));
const LearningTracker = React.lazy(() => import('./parts/learningTracker/Main'));
const Entertainment = React.lazy(() => import('./parts/entertainment/Main'));
const Goals = React.lazy(() => import('./parts/goals/Main'));

const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));


function App() {

  return (
    <Router>
        <Routes>
          <Route path="/central/*" element={<TheCentral />} />
          <Route path="/sessions-manager/*" element={<SessionsManager />} />
          <Route path="/learning-tracker/*" element={<LearningTracker />} />
          <Route path="/entertainment/*" element={<Entertainment />} />
          <Route path="/goals/*" element={<Goals />} />

          <Route path='/login/' element={<Login />} />
          <Route path='/register/' element={<Register />} />

          <Route path='/' element={<Intro />} />
        </Routes>
    </Router>
  );
}

export default App;