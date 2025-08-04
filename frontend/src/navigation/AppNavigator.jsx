import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Onboarding from '../screens/Onboarding.jsx';
import Dashboard from '../screens/Dashboard.jsx';
import Learn from '../screens/Learn.jsx';
import MediaExplorer from '../screens/MediaExplorer.jsx';
import GoalView from '../screens/GoalView.jsx';
import MyVocabulary from '../screens/MyVocabulary.jsx';
import NotFound from '../screens/NotFound.jsx';

export default function AppNavigator() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/media" element={<MediaExplorer />} />
          <Route path="/goals" element={<GoalView />} />
          <Route path="/vocabulary" element={<MyVocabulary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}
