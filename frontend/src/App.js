import React, { useState } from 'react';
import UserRedeem from './components/UserRedeem';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [view, setView] = useState('user'); // 'user' or 'admin'

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-indigo-300 to-purple-200 flex flex-col items-center py-8">
      <header className="w-full max-w-4xl flex justify-between items-center text-white">
        <h1 className="text-2xl font-bold">Redeem Your Luck</h1>
        <div className="flex">
          <button className="ml-2 px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white" onClick={() => setView('user')}>User</button>
          <button className="ml-2 px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white" onClick={() => setView('admin')}>Admin</button>
        </div>
      </header>

      <main className="w-full max-w-4xl mt-6">
        {view === 'user' && <UserRedeem />}
        {view === 'admin' && !token && <Login onLogin={(t)=>{ setToken(t); localStorage.setItem('adminToken', t); }} />}
        {view === 'admin' && token && <AdminPanel token={token} onLogout={()=>{ setToken(''); localStorage.removeItem('adminToken'); }} />}
      </main>
    </div>
  );
}

export default App;
