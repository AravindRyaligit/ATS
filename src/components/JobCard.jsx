import React from 'react';

const STATUS_COLORS = {
    'Applied': 'bg-gray',
    'Pending Response': 'bg-blue',
    'Interview Scheduled': 'bg-yellow',
    'Rejected': 'bg-red',
    'Accepted': 'bg-green'
};

export default function JobCard({ job, onClick }) {
    const statusClass = STATUS_COLORS[job.status] || 'bg-gray';

    return (
        <div
            className="card"
            onClick={() => onClick(job)}
            style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                marginBottom: '0.75rem',
                border: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: 'var(--bg-card)',
                transition: 'background-color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
        >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                {job.position}
            </h3>

            <span className={`badge ${statusClass}`} style={{ marginLeft: 'auto' }}>
                {job.status}
            </span>
        </div>
    );
}
