import React, { useState } from 'react';
import axios from 'axios';

export default function UserRedeem(){
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');

  const handleRedeem = async () => {
    setResult('');
    if(!name || !phone || !code){ setResult('Please fill all fields'); return; }
    try {
      const res = await axios.post('http://localhost:5000/api/redeem', { name, phone, code });
      setResult(res.data.message);
      setCode('');
    } catch (err) {
      setResult(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-white w-full">
      <h2 className="text-xl font-semibold">🎯 Redeem (User)</h2>
      <div className="mt-4 space-y-3">
        <div>
          <label className="text-sm text-white/90 block mb-1">Name</label>
          <input className="w-full p-2 rounded-md bg-white text-gray-900 placeholder-gray-500" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" />
        </div>
        <div>
          <label className="text-sm text-white/90 block mb-1">Phone</label>
          <input className="w-full p-2 rounded-md bg-white text-gray-900 placeholder-gray-500" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" />
        </div>
        <div>
          <label className="text-sm text-white/90 block mb-1">Redeem Code</label>
          <input className="w-full p-2 rounded-md bg-white text-gray-900 placeholder-gray-500" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="CODE-XXXX-XXXX" />
        </div>
      </div>
      <div className="mt-4">
        <button className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white" onClick={handleRedeem}>Redeem</button>
      </div>
  {result && <div className="text-sm text-white/80 mt-3">{result}</div>}
    </div>
  );
}
