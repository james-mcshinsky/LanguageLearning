import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Onboarding from '../screens/Onboarding.jsx';
import Dashboard from '../screens/Dashboard.jsx';
import Learn from '../screens/Learn.jsx';
import MediaExplorer from '../screens/MediaExplorer.jsx';
import GoalView from '../screens/GoalView.jsx';
import Analytics from '../screens/Analytics.jsx';

export default function AppNavigator() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/media" element={<MediaExplorer />} />
          <Route path="/goals" element={<GoalView />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </Router>
  );
}
