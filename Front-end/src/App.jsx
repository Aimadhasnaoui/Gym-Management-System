import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { INITIAL_CHECKINS } from './data/mockData';
import { getMembers, createMember, updateMember, deleteMember } from './api/members';
import { getPlans } from './api/plans';
import api from './api/index';
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar gymName="FitCore" onLogout={onLogout} />
      <main className="pl-[220px] flex-1 bg-app h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  const [auth, setAuth] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [checkins, setCheckins] = useState(INITIAL_CHECKINS);
  const [plans, setPlans] = useState([]);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setAuth(res.data.data))
      .catch(() => setAuth(null))
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (auth?.role !== 'admin') return;
    Promise.all([getMembers(), getPlans()])
      .then(([m, p]) => { setMembers(m); setPlans(p); })
      .catch(console.error);
  }, [auth]);

  if (authLoading) return null;

  const isAdmin = auth?.role === 'admin';
  const isMember = auth?.role === 'member';

  const handleLogout = async () => {
    await api.post('/auth/logout').catch(() => { });
    setAuth(null);
  };

  const handleAddMember = async (formData) => {
    const newMember = await createMember(formData);
    setMembers(prev => [newMember, ...prev]);
  };

  const handleEditMember = async (id, formData) => {
    const updated = await updateMember(id, formData);
    setMembers(prev => prev.map(m => m._id === id ? updated : m));
    setEditingMember(null);
  };

  const handleDeleteMember = async (id) => {
    await deleteMember(id);
    setMembers(prev => prev.filter(m => m._id !== id));
  };

  const memberModal = addMemberOpen && (
    <AddMemberModal
      onClose={() => { setAddMemberOpen(false); setEditingMember(null); }}
      onAdd={handleAddMember}
      onEdit={handleEditMember}
      editingMember={editingMember}
      plans={plans}
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
                <MembersPage members={members} setAddMemberOpen={setAddMemberOpen} />
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
                  members={members} checkins={checkins}
                  onDeleteMember={handleDeleteMember}
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
              <MemberPortal memberId={auth.memberId} checkins={checkins} onLogout={handleLogout} />
          }
        />

        <Route path="/" element={<Navigate to={isAdmin ? '/dashboard' : isMember ? '/portal' : '/login'} replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
