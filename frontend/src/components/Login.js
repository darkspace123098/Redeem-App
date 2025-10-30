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
    <div className="card">
      <h2>Admin Login</h2>
      <div className="input"><label>Username</label><input value={user} onChange={e=>setUser(e.target.value)} /></div>
      <div className="input"><label>Password</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} /></div>
      <button className="btn" onClick={submit}>Login</button>
      {err && <div className="small" style={{marginTop:8,color:'#ffdddd'}}>{err}</div>}
    </div>
  );
}
