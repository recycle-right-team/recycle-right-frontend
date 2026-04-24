import React, { useState } from 'react';
import './CollectorVetting.css';

const mockData = [
    {
        id: 1,
        name: 'Ali Khan',
        cnic: '42101-1234567-1',
        phone: '03001234567',
        city: 'Karachi',
        status: 'pending',
        cnicFront: 'https://via.placeholder.com/300x180',
        cnicBack: 'https://via.placeholder.com/300x180',
    },
    {
        id: 2,
        name: 'Ahmed Raza',
        cnic: '35202-7654321-5',
        phone: '03111234567',
        city: 'Lahore',
        status: 'pending',
        cnicFront: 'https://via.placeholder.com/300x180',
        cnicBack: 'https://via.placeholder.com/300x180',
    }
];

function CollectorVetting() {
    const [requests, setRequests] = useState(mockData);
    const [selected, setSelected] = useState(null);

    const handleApprove = (id) => {
        setRequests(prev => prev.filter(r => r.id !== id));
        setSelected(null);
    };

    const handleReject = (id) => {
        setRequests(prev => prev.filter(r => r.id !== id));
        setSelected(null);
    };

    return (
        <div className="ui-page">
            <div className="ui-pageHeader">
                <div>
                    <h1 className="ui-pageTitle">Collector Vetting</h1>
                    <p className="ui-pageSubtitle">Review and approve collector registration requests</p>
                </div>
            </div>

            <div className="ui-card">
                <div className="ui-cardBody">
                    <table className="ui-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>CNIC</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.name}</td>
                                    <td className="ui-mono">{r.cnic}</td>
                                    <td>{r.phone}</td>
                                    <td>{r.city}</td>
                                    <td>
                                        <button className="view-btn" onClick={() => setSelected(r)}>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {requests.length === 0 && (
                        <div className="empty-state">No pending requests</div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {selected && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{selected.name}</h2>

                        <div className="details-grid">
                            <div>
                                <strong>CNIC:</strong> {selected.cnic}
                            </div>
                            <div>
                                <strong>Phone:</strong> {selected.phone}
                            </div>
                            <div>
                                <strong>City:</strong> {selected.city}
                            </div>
                        </div>

                        <div className="image-section">
                            <div>
                                <p>CNIC Front</p>
                                <img src={selected.cnicFront} alt="cnic front" />
                            </div>
                            <div>
                                <p>CNIC Back</p>
                                <img src={selected.cnicBack} alt="cnic back" />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="approve" onClick={() => handleApprove(selected.id)}>
                                Approve
                            </button>
                            <button className="reject" onClick={() => handleReject(selected.id)}>
                                Reject
                            </button>
                            <button className="close" onClick={() => setSelected(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CollectorVetting;