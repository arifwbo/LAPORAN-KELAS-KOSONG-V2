import React, { useState, useEffect } from 'react';
import { User } from './types';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import StudentForm from './components/StudentForm';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'admin' | 'student'>('login');

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setView(parsedUser.role === 'admin' ? 'admin' : 'student');
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setView(loggedInUser.role === 'admin' ? 'admin' : 'student');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setView('login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {view === 'login' && <Login onLogin={handleLogin} />}
      {view === 'admin' && user && (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}
      {view === 'student' && user && (
        <StudentForm user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
