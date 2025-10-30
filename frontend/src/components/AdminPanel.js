import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPanel({ token, onLogout }){
  const [codes, setCodes] = useState([]);
  const [reds, setReds] = useState([]);
  const [newCodes, setNewCodes] = useState('');
  const [msg, setMsg] = useState('');

  const authHeader = { headers: { Authorization: 'Bearer ' + token } };

  const fetchData = async () => {
    try {
      const [cRes, rRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/codes', authHeader),
        axios.get('http://localhost:5000/api/admin/redemptions', authHeader)
      ]);
      setCodes(cRes.data);
      setReds(rRes.data);
    } catch (e) {
      console.error(e);
      if (e.response?.status === 401) onLogout();
    }
  };

  useEffect(()=>{ fetchData(); }, []);

  const submitCodes = async () => {
    if(!newCodes) return;
    const arr = newCodes.split(/\n|,|;/).map(s=>s.trim()).filter(Boolean);
    try {
      await axios.post('http://localhost:5000/api/admin/codes', { codes: arr }, authHeader);
      setMsg('Codes added');
      setNewCodes('');
      fetchData();
    } catch (e) { setMsg('Error'); }
  };

  const toggleUsed = async (id, isUsed) => {
    await axios.put('http://localhost:5000/api/admin/code/' + id, { isUsed: !isUsed }, authHeader);
    fetchData();
  };

  return (
    <div>
      <div className="card">
        <h2>Admin Panel</h2>
        <div style={{display:'flex', gap:10}}>
          <textarea placeholder="One code per line or comma separated" value={newCodes} onChange={e=>setNewCodes(e.target.value)} style={{flex:1,height:100}} />
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <button className="btn" onClick={submitCodes}>Add Codes</button>
            <button className="btn" onClick={()=>{ axios.post('http://localhost:5000/api/admin/seed', {}, authHeader).then(()=>fetchData()); }}>Seed Sample</button>
            <button className="btn" onClick={()=>{ localStorage.removeItem('adminToken'); onLogout(); }}>Logout</button>
          </div>
        </div>
        {msg && <div className="small">{msg}</div>}
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3>Codes</h3>
        <table className="table">
          <thead><tr><th>Code</th><th>Used</th><th>Action</th></tr></thead>
          <tbody>
            {codes.map(c=>(
              <tr key={c._id}>
                <td>{c.code}</td>
                <td>{c.isUsed ? (c.redeemedAt ? new Date(c.redeemedAt).toLocaleString() : 'Yes') : 'No'}</td>
                <td><button className="btn" onClick={()=>toggleUsed(c._id, c.isUsed)}>{c.isUsed ? 'Mark Unused' : 'Mark Used'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3>Redemptions</h3>
        <table className="table">
          <thead><tr><th>Name</th><th>Phone</th><th>Code</th><th>Reward</th><th>Date</th></tr></thead>
          <tbody>
            {reds.map(r=>(
              <tr key={r._id}>
                <td>{r.name}</td>
                <td>{r.phone}</td>
                <td>{r.code}</td>
                <td>{r.reward}</td>
                <td>{new Date(r.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
