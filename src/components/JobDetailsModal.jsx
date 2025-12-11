import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Download, Trash2, MapPin, User, Calendar, Briefcase, Link, AlertTriangle, Globe } from 'lucide-react';
import { downloadFile } from '../lib/storage';

export default function JobDetailsModal({ job, isOpen, onClose, onDelete, onEdit }) {
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsDeleting(false);
        }
    }, [isOpen]);

    if (!job) return null;

    const handleDeleteClick = () => {
        setIsDeleting(true);
    };

    const confirmDelete = () => {
        onDelete(job.id);
        onClose();
    };

    const cancelDelete = () => {
        setIsDeleting(false);
    };

    if (isDeleting) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Delete Application?">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem 0' }}>
                    <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        padding: '1rem',
                        borderRadius: '50%',
                        marginBottom: '1rem',
                        color: 'var(--danger)'
                    }}>
                        <AlertTriangle size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Are you sure?</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        This will permanently delete the application for <strong>{job.position}</strong> at <strong>{job.company}</strong>. This action cannot be undone.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                        <button className="btn" style={{ flex: 1, backgroundColor: 'var(--bg-input)' }} onClick={cancelDelete}>
                            No, Keep it
                        </button>
                        <button className="btn btn-danger" style={{ flex: 1 }} onClick={confirmDelete}>
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    const DetailRow = ({ icon: Icon, label, value }) => (
        <div style={{ display: 'flex', marginBottom: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '2rem', color: 'var(--text-secondary)' }}><Icon size={18} /></div>
            <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>{label}</div>
                <div style={{ fontSize: '1rem' }}>{value || '-'}</div>
            </div>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Job Details">
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{job.position}</h3>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{job.company}</p>
                </div>
                <span className={`badge bg-blue`} style={{ fontSize: '0.9rem' }}>{job.status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <DetailRow icon={MapPin} label="Location" value={job.location} />
                <DetailRow icon={Globe} label="Country" value={job.country} />
                <DetailRow icon={User} label="HR Contact" value={job.hrContact} />
                <DetailRow icon={Link} label="Method" value={job.method} />
                <DetailRow icon={Calendar} label="Applied On" value={new Date(job.createdAt).toLocaleDateString()} />
                {job.jobUrl && (
                    <div style={{ display: 'flex', marginBottom: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ width: '2rem', color: 'var(--text-secondary)' }}><Link size={18} /></div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Job Info</div>
                            <a href={job.jobUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                                Open Job Post
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {job.remarks && (
                <div style={{ marginTop: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <label className="label">Remarks</label>
                    <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{job.remarks}</p>
                </div>
            )}

            <div style={{ marginTop: '1.5rem' }}>
                <label className="label">Attachments</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {job.cvFile ? (
                        <button className="btn" style={{ backgroundColor: 'white', color: 'black', gap: '0.5rem' }} onClick={() => downloadFile(job.cvFile)}>
                            <Download size={16} />
                            Download CV
                        </button>
                    ) : <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No CV attached</span>}

                    {job.coverLetterFile ? (
                        <button className="btn" style={{ backgroundColor: 'white', color: 'black', gap: '0.5rem' }} onClick={() => downloadFile(job.coverLetterFile)}>
                            <Download size={16} />
                            Download Cover Letter
                        </button>
                    ) : null}
                </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn" style={{ backgroundColor: 'white', color: 'black' }} onClick={() => onEdit(job)}>
                    Edit Application
                </button>
                <button className="btn btn-danger" onClick={handleDeleteClick} style={{ gap: '0.5rem' }}>
                    <Trash2 size={16} />
                    Delete Application
                </button>
            </div>
        </Modal>
    );
}
