import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, BookOpen, Clock } from 'lucide-react';
import { getSkills, saveSkill, deleteSkill } from '../lib/storage';

const STATUS_CONFIG = {
    'Yet to start': { color: '#9ca3af', icon: Clock },
    'Learning': { color: '#3b82f6', icon: BookOpen },
    'Completed': { color: '#10b981', icon: CheckCircle }
};

export default function SkillsSection() {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        const stored = await getSkills();
        setSkills(stored);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;

        const skill = {
            id: crypto.randomUUID(),
            name: newSkill.trim(),
            status: 'Yet to start',
            createdAt: Date.now()
        };

        await saveSkill(skill);
        setNewSkill('');
        setIsAdding(false);
        await loadSkills();
    };

    const handleUpdateStatus = async (skill, newStatus) => {
        const updated = { ...skill, status: newStatus };
        // Optimistic update
        setSkills(prev => prev.map(s => s.id === skill.id ? updated : s));
        await saveSkill(updated);
    };

    const handleDelete = async (id) => {
        if (!confirm('Remove this skill?')) return;
        await deleteSkill(id);
        await loadSkills();
    };

    return (
        <div style={{ marginTop: '3rem' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Skills to Learn</h2>
                <span style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: '0.2rem 0.8rem',
                    borderRadius: '99px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)'
                }}>
                    Count: <strong style={{ color: 'var(--text-primary)' }}>{skills.length}</strong>
                </span>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem'
            }}>
                {skills.map(skill => {
                    const StatusIcon = STATUS_CONFIG[skill.status]?.icon || Clock;
                    const statusColor = STATUS_CONFIG[skill.status]?.color || '#9ca3af';

                    return (
                        <div key={skill.id} style={{
                            backgroundColor: 'var(--bg-card)',
                            padding: '1.25rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{skill.name}</h3>
                                <button
                                    onClick={() => handleDelete(skill.id)}
                                    className="btn-icon"
                                    style={{ color: 'var(--text-secondary)', padding: '0.25rem' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    flex: 1,
                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: 'var(--radius-sm)'
                                }}>
                                    <StatusIcon size={16} color={statusColor} />
                                    <select
                                        value={skill.status}
                                        onChange={(e) => handleUpdateStatus(skill, e.target.value)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: statusColor,
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            width: '100%',
                                            cursor: 'pointer',
                                            outline: 'none'
                                        }}
                                    >
                                        {Object.keys(STATUS_CONFIG).map(status => (
                                            <option key={status} value={status} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add New Skill Card */}
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '130px'
                }}>
                    {isAdding ? (
                        <form onSubmit={handleAdd} style={{ width: '100%', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                            <input
                                autoFocus
                                className="input"
                                placeholder="Skill name..."
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                style={{ fontSize: '0.9rem' }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.4rem' }}>Add</button>
                                <button type="button" className="btn" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '0.4rem' }}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="btn"
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                padding: '0.5rem',
                                borderRadius: '50%'
                            }}>
                                <Plus size={24} />
                            </div>
                            <span>Add New Skill</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
