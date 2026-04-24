import React, { useState, useEffect } from 'react';
import './Collectors.css';

const USE_MOCK = true;

const mockCollectors = [
  {
    _id: '1',
    name: 'Ali Khan',
    email: 'ali.khan@example.com',
    phone: '03001234567',
    city: 'Karachi',
    status: 'Verified',
    totalPickups: 12
  },
  {
    _id: '2',
    name: 'Ahmed Raza',
    email: 'ahmed.raza@example.com',
    phone: '03111234567',
    city: 'Lahore',
    status: 'Verified',
    totalPickups: 42
  }
];

function Collectors() {
  const [collectors, setCollectors] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });

  useEffect(() => {
    if (USE_MOCK) {
      setCollectors(mockCollectors);
      return;
    }
    // real API here
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', city: '' });
    setModalOpen(true);
  };

  const openEdit = (collector) => {
    setEditing(collector);
    setForm(collector);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setCollectors(prev =>
        prev.map(c => c._id === editing._id ? { ...form } : c)
      );
    } else {
      setCollectors(prev => [
        ...prev,
        { ...form, _id: Date.now().toString(), status: 'Verified', totalPickups: 0 }
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this collector?')) return;
    setCollectors(prev => prev.filter(c => c._id !== id));
  };

  const filtered = collectors.filter(c =>
    Object.values(c).join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ui-page">
      <div className="ui-pageHeader">
        <div>
          <h1 className="ui-pageTitle">Collector Management</h1>
          <p className="ui-pageSubtitle">Manage all registered collectors</p>
        </div>

        <div className="header-actions">
          <input
            type="text"
            placeholder="Search collectors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="add-btn" onClick={openAdd}>
            + Add Collector
          </button>
        </div>
      </div>

      <div className="ui-card">
        <div className="ui-cardBody">
          <table className="ui-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Pickups</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.city}</td>
                  <td>{c.totalPickups}</td>
                  <td>
                    <button className="btn-edit" onClick={() => openEdit(c)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-state">No collectors found</div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editing ? 'Edit Collector' : 'Add Collector'}</h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
            />

            <div className="modal-actions">
              <button className="approve" onClick={handleSave}>
                Save
              </button>
              <button className="close" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collectors;