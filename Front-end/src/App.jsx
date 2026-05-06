import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { INITIAL_MEMBERS, INITIAL_CHECKINS, PLANS } from './data/mockData';
import Sidebar from './components/Sidebar';
import AddMemberModal from './components/AddMemberModal';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import CheckinPage from './pages/CheckinPage';
import MemberPortal from './pages/MemberPortal';

function AdminLayout({ children, onLogout }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar gymName="FitCore" onLogout={onLogout} />
      <main style={{ marginLeft: 220, flex: 1, background: '#f5f5f3', minHeight: '100vh', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  const [auth, setAuth] = useState(null);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [checkins, setCheckins] = useState(INITIAL_CHECKINS);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  const handleLogout = () => setAuth(null);
  const handleAddMember = (m) => setMembers(prev => [m, ...prev]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            auth === 'admin' ? <Navigate to="/dashboard" replace /> :
            auth === 'member' ? <Navigate to="/portal" replace /> :
            <LoginPage onLogin={setAuth} />
          }
        />

        <Route
          path="/dashboard"
          element={
            auth !== 'admin' ? <Navigate to="/login" replace /> :
            <AdminLayout onLogout={handleLogout}>
              <DashboardPage members={members} checkins={checkins} setAddMemberOpen={setAddMemberOpen} />
              {addMemberOpen && <AddMemberModal onClose={() => setAddMemberOpen(false)} onAdd={handleAddMember} />}
            </AdminLayout>
          }
        />

        <Route
          path="/members"
          element={
            auth !== 'admin' ? <Navigate to="/login" replace /> :
            <AdminLayout onLogout={handleLogout}>
              <MembersPage members={members} plans={PLANS} setAddMemberOpen={setAddMemberOpen} />
              {addMemberOpen && <AddMemberModal onClose={() => setAddMemberOpen(false)} onAdd={handleAddMember} />}
            </AdminLayout>
          }
        />

        <Route
          path="/checkin"
          element={
            auth !== 'admin' ? <Navigate to="/login" replace /> :
            <AdminLayout onLogout={handleLogout}>
              <CheckinPage members={members} checkins={checkins} setCheckins={setCheckins} />
            </AdminLayout>
          }
        />

        <Route
          path="/portal"
          element={
            auth !== 'member' ? <Navigate to="/login" replace /> :
            <MemberPortal members={members} checkins={checkins} plans={PLANS} onLogout={handleLogout} />
          }
        />

        <Route path="/" element={<Navigate to={auth === 'admin' ? '/dashboard' : auth === 'member' ? '/portal' : '/login'} replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
