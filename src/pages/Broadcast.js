import React, { useState } from 'react';
import './Broadcast.css';

function Broadcast() {
    const [form, setForm] = useState({
        title: '',
        message: '',
        area: '',
        type: 'info',
        fallback: ''
    });

    const [sentMessages, setSentMessages] = useState([]);

    const handleSend = () => {
        if (!form.message.trim()) return;

        const newBroadcast = {
            ...form,
            id: Date.now(),
            time: new Date().toLocaleString()
        };

        setSentMessages([newBroadcast, ...sentMessages]);

        // 🔥 HERE: API call would go to backend to push to mobile apps
        console.log('Broadcast sent:', newBroadcast);

        setForm({
            title: '',
            message: '',
            area: '',
            type: 'info',
            fallback: ''
        });
    };

    return (
        <div className="ui-page">

            <div className="ui-pageHeader">
                <div>
                    <h1 className="ui-pageTitle">Broadcast System</h1>
                    <p className="ui-pageSubtitle">
                        Send real-time updates to collectors & households
                    </p>
                </div>
            </div>

            {/* FORM */}
            <div className="ui-card">
                <div className="ui-cardBody broadcast-form">

                    <input
                        placeholder="Title (optional)"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />

                    <textarea
                        placeholder="Broadcast message..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />

                    <div className="row">
                        <input
                            placeholder="Target Area (e.g. DHA Phase 6)"
                            value={form.area}
                            onChange={(e) => setForm({ ...form, area: e.target.value })}
                        />

                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>

                    <input
                        placeholder="Fallback suggestion (optional)"
                        value={form.fallback}
                        onChange={(e) => setForm({ ...form, fallback: e.target.value })}
                    />

                    <button className="send-btn" onClick={handleSend}>
                        Send Broadcast
                    </button>

                </div>
            </div>

            {/* HISTORY */}
            <div className="broadcast-history">
                <h2>Recent Broadcasts</h2>

                {sentMessages.map(msg => (
                    <div key={msg.id} className={`broadcast-card ${msg.type}`}>
                        <div className="broadcast-header">
                            <strong>{msg.title || 'No Title'}</strong>
                            <span>{msg.time}</span>
                        </div>

                        <p>{msg.message}</p>

                        <div className="broadcast-meta">
                            <span>📍 {msg.area || 'Global'}</span>
                            {msg.fallback && <span>➡️ {msg.fallback}</span>}
                        </div>
                    </div>
                ))}

                {sentMessages.length === 0 && (
                    <p className="empty">No broadcasts sent yet</p>
                )}
            </div>

        </div>
    );
}

export default Broadcast;