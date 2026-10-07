import React, { useState } from 'react';
import { Users, FileText, Calendar, CheckCircle2, Download, Plus, X } from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';
import esgStore from '../../../../services/esgStore';

export default function ESGCommitteeDeskScreen() {
  const [meetings, setMeetings] = useState([
    { id: 'MTG-01', date: '18 Oct 2024', title: 'Q2 FY25 Board ESG Committee Review', chair: 'Justice (Retd.) K. Rao (Independent Director)', agenda: 'BRSR Core readiness, Scope 3 supply chain baseline, CSR ₹84.6 Cr disbursement', status: 'Completed & Signed' },
    { id: 'MTG-02', date: '12 Jul 2024', title: 'Q1 FY25 Board ESG Committee Review', chair: 'Justice (Retd.) K. Rao', agenda: 'GHG v19 recalculation, TCFD scenario analysis, ZLD water recycling compliance', status: 'Minutes Filed' },
    { id: 'MTG-03', date: '25 Nov 2024 (Upcoming)', title: 'Special Strategy Session: Hydrogen & CBAM', chair: 'Board Chairman & MD', agenda: 'European CBAM carbon border tax risk mitigation, green fleet expansion capex', status: 'Scheduled' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newChair, setNewChair] = useState('Justice (Retd.) K. Rao');
  const [newAgenda, setNewAgenda] = useState('');
  const [newDate, setNewDate] = useState('15 Dec 2024');

  const handleCreateMemo = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAgenda.trim()) return;
    const memoObj = {
      id: `MTG-${String(meetings.length + 1).padStart(2, '0')}`,
      date: newDate,
      title: newTitle.trim(),
      chair: newChair.trim(),
      agenda: newAgenda.trim(),
      status: 'Scheduled'
    };
    setMeetings([memoObj, ...meetings]);
    esgStore.addAuditLog('ESG_COMMITTEE_MEMO_CREATED', `Created Board memo: ${memoObj.title}`, 'STRATEGY');
    setIsModalOpen(false);
    setNewTitle('');
    setNewAgenda('');
  };

  const handleDownloadMinutes = (m) => {
    exportToCsv(`MEIL_Board_ESG_Memo_${m.id}.csv`, [
      {
        'Meeting ID': m.id,
        'Date': m.date,
        'Title': m.title,
        'Chairperson': m.chair,
        'Agenda and Resolutions': m.agenda,
        'Status': m.status
      }
    ]);
  };

  return (
    <div className="esg-mgr-committee">
      <div className="esg-mgr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="esg-mgr-card-header">
          <div>
            <h2 className="esg-mgr-card-title">Board ESG Committee Governance Desk</h2>
            <p className="esg-mgr-card-subtitle">
              Board oversight meeting records, resolutions, approved sustainability policies, and quarterly briefings
            </p>
          </div>
          <button className="esg-mgr-btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} /> New Committee Memo
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {meetings.map((m) => (
          <div key={m.id} className="esg-mgr-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Calendar size={14} color="#047857" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857' }}>{m.date}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{m.title}</h3>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>Chairperson: {m.chair}</div>
              </div>
              <span className="esg-mgr-badge-emerald">{m.status}</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: '0.5rem 0' }}>
              <strong>Agenda & Resolutions:</strong> {m.agenda}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button 
                className="esg-mgr-btn-outline" 
                style={{ fontSize: '0.78rem' }}
                onClick={() => handleDownloadMinutes(m)}
              >
                <Download size={13} /> Download Minutes & Board Memo
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '520px',
            padding: '1.5rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Schedule Board ESG Committee Memo</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateMemo} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>Meeting Title</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)} 
                  placeholder="e.g., Q3 FY25 Strategic Decarbonization Review"
                  required 
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>Chairperson</label>
                  <input 
                    type="text" 
                    value={newChair} 
                    onChange={e => setNewChair(e.target.value)} 
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>Scheduled Date</label>
                  <input 
                    type="text" 
                    value={newDate} 
                    onChange={e => setNewDate(e.target.value)} 
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }} 
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>Key Agenda & Resolutions</label>
                <textarea 
                  rows={3} 
                  value={newAgenda} 
                  onChange={e => setNewAgenda(e.target.value)} 
                  placeholder="Enter strategic agenda items, regulatory approvals, and Capex resolutions..."
                  required 
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', resize: 'vertical' }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="esg-mgr-btn-outline" style={{ fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button type="submit" className="esg-mgr-btn-primary" style={{ fontSize: '0.85rem' }}>
                  Save & Log Memo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
