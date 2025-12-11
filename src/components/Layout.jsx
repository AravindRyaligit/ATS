import React from 'react';
import { Briefcase, Plus } from 'lucide-react';

export default function Layout({ children, onAddJob }) {
    return (
        <div className="layout">
            <header className="header" style={{
                backgroundColor: 'var(--bg-card)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                padding: '1rem 0',
                marginBottom: '2rem'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex'
                        }}>
                            <Briefcase size={24} color="white" />
                        </div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
                            JobTracker
                        </h1>
                    </div>

                    <button className="btn btn-primary" onClick={onAddJob}>
                        <Plus size={18} />
                        <span>Add Job</span>
                    </button>
                </div>
            </header>

            <main className="main container">
                {children}
            </main>
        </div>
    );
}
