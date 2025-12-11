import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Upload, X, FileText } from 'lucide-react';

const COUNTRIES = [
    'India', 'Germany', 'Canada', 'Poland', 'Switzerland', 'Netherlands', 'UAE', 'Luxembourg', 'Belgium', 'Asian'
];

const getLocalDateString = (timestamp) => {
    const d = timestamp ? new Date(timestamp) : new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function AddJobModal({ isOpen, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        position: '',
        company: '',
        method: 'LinkedIn',
        status: 'Applied',
        country: '',
        hrContact: '',
        location: '',
        location: '',
        remarks: '',
        jobUrl: '',
        interviewDate: '',
        interviewTime: '',
        interviewRound: '',
        appliedDate: new Date().toISOString().split('T')[0]
    });
    const [cvFile, setCvFile] = useState(null);
    const [clFile, setClFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    position: initialData.position,
                    company: initialData.company,
                    method: initialData.method,
                    status: initialData.status,
                    country: initialData.country || '',
                    hrContact: initialData.hrContact,
                    location: initialData.location,
                    location: initialData.location,
                    remarks: initialData.remarks || '',
                    jobUrl: initialData.jobUrl || '',
                    interviewDate: initialData.interviewDate || '',
                    interviewTime: initialData.interviewTime || '',
                    interviewRound: initialData.interviewRound || '',
                    appliedDate: getLocalDateString(initialData.createdAt)
                });
                // Keep existing files logic is handled in submit, UI just shows empty for now or we could show "Existing file attached"
                // For simplicity, we leave file inputs cleared. User re-uploads only if they want to change.
            } else {
                setFormData({
                    position: '',
                    company: '',
                    method: 'LinkedIn',
                    status: 'Applied',
                    country: '',
                    hrContact: '',
                    location: '',
                    location: '',
                    remarks: '',
                    jobUrl: '',
                    interviewDate: '',
                    interviewTime: '',
                    interviewRound: '',
                    appliedDate: getLocalDateString()
                });
                setCvFile(null);
                setClFile(null);
            }
        }
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e, setFile) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create local timestamp for the selected date
            let createdTimestamp = Date.now();
            if (formData.appliedDate) {
                const [y, m, d] = formData.appliedDate.split('-').map(Number);
                createdTimestamp = new Date(y, m - 1, d).getTime();
            }

            const newJob = {
                ...formData,
                id: initialData ? initialData.id : crypto.randomUUID(),
                createdAt: createdTimestamp,
                // For files, we store the File object directly; idb-keyval handles it.
                // We structure it to keep metadata.
                cvFile: cvFile ? { name: cvFile.name, data: cvFile } : (initialData?.cvFile),
                coverLetterFile: clFile ? { name: clFile.name, data: clFile } : (initialData?.coverLetterFile),
            };

            await onSave(newJob);
            onClose();
        } catch (err) {
            console.error("Failed to save job:", err);
            alert("Failed to save job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const FileInput = ({ label, file, setFile, id }) => (
        <div className="form-group">
            <label className="label">{label}</label>
            {!file ? (
                <label htmlFor={id} className="file-drop">
                    <Upload size={24} style={{ marginBottom: '0.5rem' }} />
                    <p>Click to upload {label}</p>
                    <input
                        type="file"
                        id={id}
                        onChange={(e) => handleFileChange(e, setFile)}
                        style={{ display: 'none' }}
                        accept=".pdf,.doc,.docx"
                    />
                </label>
            ) : (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={18} className="text-secondary" />
                        <span style={{ fontSize: '0.9rem' }}>{file.name}</span>
                    </div>
                    <button type="button" className="btn-icon" onClick={() => setFile(null)}>
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Application" : "Add New Application"}>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="label">Position Name *</label>
                        <input required name="position" className="input" placeholder="e.g. Frontend Dev" value={formData.position} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="label">Company Name *</label>
                        <input required name="company" className="input" placeholder="e.g. Google" value={formData.company} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="label">Applied On</label>
                        <input type="date" required name="appliedDate" className="input" value={formData.appliedDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="label">Application Method</label>
                        <input name="method" className="input" placeholder="e.g. LinkedIn, Referral" value={formData.method} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="label">Job Info</label>
                        <input type="url" name="jobUrl" className="input" placeholder="https://..." value={formData.jobUrl} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="label">Status</label>
                        <select name="status" className="select" value={formData.status} onChange={handleChange}>
                            <option>Applied</option>
                            <option>Pending Response</option>
                            <option>Interview Scheduled</option>
                            <option>Rejected</option>
                            <option>Accepted</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="label">Location</label>
                        <input name="location" className="input" placeholder="e.g. London, Remote" value={formData.location} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="label">Country</label>
                        <select name="country" className="select" value={formData.country} onChange={handleChange}>
                            <option value="">Select Country</option>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="label">HR Contact</label>
                        <input name="hrContact" className="input" placeholder="Name / Email" value={formData.hrContact} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="label">Remarks</label>
                    <textarea
                        name="remarks"
                        className="textarea"
                        rows="3"
                        placeholder="Any additional notes..."
                        value={formData.remarks}
                        onChange={handleChange}
                    />
                </div>

                {formData.status === 'Interview Scheduled' && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Interview Details</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="label">Date</label>
                                <input type="date" name="interviewDate" className="input" value={formData.interviewDate || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="label">Time</label>
                                <input type="time" name="interviewTime" className="input" value={formData.interviewTime || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="label">Round</label>
                                <input
                                    name="interviewRound"
                                    className="input"
                                    placeholder="e.g. Technical, HR"
                                    value={formData.interviewRound || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <FileInput label="CV / Resume" file={cvFile} setFile={setCvFile} id="cv_upload" />
                    <FileInput label="Cover Letter" file={clFile} setFile={setClFile} id="cl_upload" />
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" className="btn" style={{ color: 'var(--text-secondary)' }} onClick={onClose}>Cancel</button>
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Saving...' : 'Save Job'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
