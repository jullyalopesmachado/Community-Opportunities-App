import { useState } from 'react'
import WelcomePage from '/src/components/WelcomePage.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanelOp from '/src/components/AdminPanelOp.jsx';
import AdminPanelUser from '/src/components/AdminPanelUser.jsx';
import ProfilePage from '/src/components/ProfilePage.jsx';
import OpportunitiesListPage from '/src/components/OppListPage.jsx';
import UserListPage from '/src/components/UserList.jsx';
import User from '/src/components/User.jsx';
import OppPage from '/src/components/OppPage.jsx';

import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';


function App() {

  return (
    <Router>
      <Routes>

      <Route path="/" element={<WelcomePage />} /> 
      <Route path="/profile" element={<ProfilePage />} />
      
      <Route path="/adminPanelOp" element={<AdminPanelOp />} />
      <Route path="/adminPanelUser" element={<AdminPanelUser />} />
      <Route path="/profilePage" element={<ProfilePage />} />
      <Route path="/userListPage" element={<UserListPage />} />
      <Route path="/oppPage" element={<OpportunitiesListPage />} />
      <Route path="/user/:id" element={<User />} />

      <Route path="/opportunity/:id" element={<OppPage />} />

      </Routes>
    </Router>
  );
}

export default App
