import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { INITIAL_MEMBERS, INITIAL_CHECKINS, PLANS } from './data/mockData';
import PlansPage from './pages/PlansPage';
import Sidebar from './components/Sidebar';
import AddMemberModal from './components/AddMemberModal';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import CheckinPage from './pages/CheckinPage';
import MemberPortal from './pages/MemberPortal';
import MemberProfilePage from './pages/MemberProfilePage';

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
  const [plans, setPlans] = useState(PLANS);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const isAdmin = auth?.role === 'admin';
  const isMember = auth?.role === 'member';

  const handleLogout = () => setAuth(null);
  const handleAddMember = (m) => setMembers(prev => [m, ...prev]);
  const handleEditMember = (updated) => { setMembers(prev => prev.map(m => m.id === updated.id ? updated : m)); setEditingMember(null); };

  const memberModal = addMemberOpen && (
    <AddMemberModal
      onClose={() => { setAddMemberOpen(false); setEditingMember(null); }}
      onAdd={handleAddMember}
      onEdit={handleEditMember}
      editingMember={editingMember}
    />
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAdmin ? <Navigate to="/dashboard" replace /> :
            isMember ? <Navigate to="/portal" replace /> :
            <LoginPage onLogin={setAuth} />
          }
        />

        <Route
          path="/dashboard"
          element={
            !isAdmin ? <Navigate to="/login" replace /> :
            <AdminLayout onLogout={handleLogout}>
              <DashboardPage members={members} checkins={checkins} setAddMemberOpen={setAddMemberOpen} />
              {memberModal}
            </AdminLayout>
          }
        />

        <Route
          path="/members"
          element={
            !isAdmin ? <Navigate to="/login" replace /> :
            <AdminLayout onLogout={handleLogout}>
              <MembersPage members={members} plans={plans} setAddMemberOpen={setAddMemberOpen} />
              {memberModal}
            </AdminLayout>
          }
        />

        <Route
          path="/members/:id"
          element={
            !isAdmin ? <Navigate to="/login" replace /> :
            <AdminLayout onLogout={handleLogout}>
              <MemberProfilePage
                members={members} plans={plans} checkins={checkins}
                setMembers={setMembers}
                onEditMember={(m) => { setEditingMember(m); setAddMemberOpen(true); }}
              />
              {memberModal}
            </AdminLayout>
          }
        />

        <Route
          path="/checkin"
          element={
            !isAdmin ? <Navigate to="/login" replace /> :
            <AdminLayout onLogout={handleLogout}>
              <CheckinPage members={members} checkins={checkins} setCheckins={setCheckins} />
            </AdminLayout>
          }
        />

        <Route
          path="/plans"
          element={
            !isAdmin ? <Navigate to="/login" replace /> :
            <AdminLayout onLogout={handleLogout}>
              <PlansPage plans={plans} setPlans={setPlans} />
            </AdminLayout>
          }
        />

        <Route
          path="/portal"
          element={
            !isMember ? <Navigate to="/login" replace /> :
            <MemberPortal memberId={auth.memberId} members={members} checkins={checkins} plans={plans} onLogout={handleLogout} />
          }
        />

        <Route path="/" element={<Navigate to={isAdmin ? '/dashboard' : isMember ? '/portal' : '/login'} replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
