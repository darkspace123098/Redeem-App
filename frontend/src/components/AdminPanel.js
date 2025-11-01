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
    <div className="w-full">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-white w-full">
        <h2 className="text-xl font-semibold">Admin Panel</h2>
        <div className="flex gap-4 mt-4">
          <textarea
            placeholder="One code per line or comma separated"
            value={newCodes}
            onChange={e=>setNewCodes(e.target.value)}
            className="flex-1 h-24 p-3 rounded-md bg-white text-gray-900 placeholder-gray-500"
          />
          <div className="flex flex-col gap-3">
            <button className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white" onClick={submitCodes}>Add Codes</button>
            <button className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white" onClick={()=>{ axios.post('http://localhost:5000/api/admin/seed', {}, authHeader).then(()=>fetchData()); }}>Seed Sample</button>
            <button className="px-4 py-2 rounded-md bg-red-500/80 hover:bg-red-500 text-white" onClick={()=>{ localStorage.removeItem('adminToken'); onLogout(); }}>Logout</button>
          </div>
        </div>
  {msg && <div className="text-sm text-white/80 mt-3">{msg}</div>}
      </div>

      <div className="bg-white/8 backdrop-blur-md p-6 rounded-xl text-white w-full mt-4">
        <h3 className="text-lg font-medium">Codes</h3>
        <table className="min-w-full divide-y divide-white/10 mt-3">
          <thead>
            <tr>
              <th className="py-2 text-left text-sm font-medium text-white/90">Code</th>
              <th className="py-2 text-left text-sm font-medium text-white/90">Used</th>
              <th className="py-2 text-left text-sm font-medium text-white/90">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {codes.map(c=> (
              <tr key={c._id}>
                <td className="py-2 text-sm text-white">{c.code}</td>
                <td className="py-2 text-sm text-white">{c.isUsed ? (c.redeemedAt ? new Date(c.redeemedAt).toLocaleString() : 'Yes') : 'No'}</td>
                <td className="py-2 text-sm">
                  <button className="px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white" onClick={()=>toggleUsed(c._id, c.isUsed)}>{c.isUsed ? 'Mark Unused' : 'Mark Used'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white/8 backdrop-blur-md p-6 rounded-xl text-white w-full mt-4">
        <h3 className="text-lg font-medium">Redemptions</h3>
        <table className="min-w-full divide-y divide-white/10 mt-3">
          <thead>
            <tr>
              <th className="py-2 text-left text-sm font-medium text-white/90">Name</th>
              <th className="py-2 text-left text-sm font-medium text-white/90">Phone</th>
              <th className="py-2 text-left text-sm font-medium text-white/90">Code</th>
              <th className="py-2 text-left text-sm font-medium text-white/90">Reward</th>
              <th className="py-2 text-left text-sm font-medium text-white/90">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {reds.map(r=> (
              <tr key={r._id}>
                <td className="py-2 text-sm text-white">{r.name}</td>
                <td className="py-2 text-sm text-white">{r.phone}</td>
                <td className="py-2 text-sm text-white">{r.code}</td>
                <td className="py-2 text-sm text-white">{r.reward}</td>
                <td className="py-2 text-sm text-white">{new Date(r.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
