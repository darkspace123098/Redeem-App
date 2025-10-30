import React, { useState } from 'react';
import UserRedeem from './components/UserRedeem';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [view, setView] = useState('user'); // 'user' or 'admin'

  return (
    <div className="app">
      <header className="app-header">
        <h1>Redeem Your Luck</h1>
        <div className="nav">
          <button onClick={() => setView('user')}>User</button>
          <button onClick={() => setView('admin')}>Admin</button>
        </div>
      </header>

      <main>
        {view === 'user' && <UserRedeem />}
        {view === 'admin' && !token && <Login onLogin={(t)=>{ setToken(t); localStorage.setItem('adminToken', t); }} />}
        {view === 'admin' && token && <AdminPanel token={token} onLogout={()=>{ setToken(''); localStorage.removeItem('adminToken'); }} />}
      </main>
    </div>
  );
}

export default App;
