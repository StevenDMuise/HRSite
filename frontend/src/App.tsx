import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import JobApplicationForm from './pages/JobApplicationForm';
import ContactsNotes from './pages/ContactsNotes';
import InterviewDetails from './pages/InterviewDetails';
import ArchiveView from './pages/ArchiveView';
import ExportPage from './pages/ExportPage';
import AccountProfile from './pages/AccountProfile';
import LoginSignup from './pages/LoginSignup';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/add" element={<JobApplicationForm />} />
        <Route path="/contacts" element={<ContactsNotes />} />
        <Route path="/interview" element={<InterviewDetails />} />
        <Route path="/archive" element={<ArchiveView />} />
        <Route path="/export" element={<ExportPage />} />
        <Route path="/account" element={<AccountProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
