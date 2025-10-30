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
    <div className="card">
      <h2>🎯 Redeem (User)</h2>
      <div className="input">
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" />
      </div>
      <div className="input">
        <label>Phone</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" />
      </div>
      <div className="input">
        <label>Redeem Code</label>
        <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="CODE-XXXX-XXXX" />
      </div>
      <button className="btn" onClick={handleRedeem}>Redeem</button>
      {result && <div className="small" style={{marginTop:10}}>{result}</div>}
    </div>
  );
}
