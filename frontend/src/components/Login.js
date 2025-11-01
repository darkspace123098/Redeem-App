import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }){
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const submit = async () => {
    setErr('');
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { username: user, password: pass });
      onLogin(res.data.token);
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-white w-full">
      <h2 className="text-xl font-semibold">Admin Login</h2>
      <div className="mt-4">
        <div className="mb-3">
          <label className="text-sm text-white/90 block mb-1">Username</label>
          <input className="w-full p-2 rounded-md bg-white text-gray-900 placeholder-gray-500" value={user} onChange={e=>setUser(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="text-sm text-white/90 block mb-1">Password</label>
          <input className="w-full p-2 rounded-md bg-white text-gray-900 placeholder-gray-500" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
        </div>
        <button className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white" onClick={submit}>Login</button>
  {err && <div className="text-sm mt-2 text-red-200">{err}</div>}
      </div>
    </div>
  );
}
