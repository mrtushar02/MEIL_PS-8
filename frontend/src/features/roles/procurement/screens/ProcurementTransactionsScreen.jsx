import React, { useState } from 'react';
import {
  Search,
  Plus,
  Upload,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { exportToCsv, triggerFileInput } from '../../../../utils/exportUtils';

export default function ProcurementTransactionsScreen({
  transactions = [],
  onNavigateTab,
  onOpenLogProcurement
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedBU, setSelectedBU] = useState('All Business Units');
  const [selectedPeriod, setSelectedPeriod] = useState('Sep 2026');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedTx, setSelectedTx] = useState(null);
  const [importFeedback, setImportFeedback] = useState(null);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier =
      selectedSupplier === 'All Suppliers' || t.supplier.includes(selectedSupplier);
    const matchesCategory =
      selectedCategory === 'All Categories' || t.category === selectedCategory;
    return matchesSearch && matchesSupplier && matchesCategory;
  });

  const getStatusChip = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="proc-status-chip completed">Completed</span>;
      case 'Verified':
        return <span className="proc-status-chip verified">Verified</span>;
      case 'In Review':
        return <span className="proc-status-chip review">In Review</span>;
      default:
        return <span className="proc-status-chip pending">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── Header & Top Action Controls ──── */}
      <div className="proc-glass-card" style={{ padding: '16px 20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Procurement
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
              Track procurement activity, supplier spend and sourcing information.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="proc-btn proc-btn-blue"
              onClick={onOpenLogProcurement}
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
            >
              <Plus size={15} />
              <span>Log Procurement</span>
            </button>
            <button
              type="button"
              className="proc-btn proc-btn-outline"
              style={{ padding: '7px 12px', fontSize: '12.5px' }}
              onClick={() => triggerFileInput((file) => {
                setImportFeedback(`ERP Voucher batch ${file.name} (${(file.size / 1024).toFixed(1)} KB) imported and verified.`);
                setTimeout(() => setImportFeedback(null), 4000);
              })}
            >
              <Upload size={14} />
              <span>Import</span>
            </button>
            <button
              type="button"
              className="proc-btn proc-btn-outline"
              style={{ padding: '7px 12px', fontSize: '12.5px' }}
              onClick={() => exportToCsv('MEIL_Procurement_Transactions.csv', transactions)}
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <div className="proc-search-bar" style={{ minWidth: '240px' }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search by transaction ID, supplier, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="proc-select-control"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Suppliers">All Suppliers</option>
            <option value="ABC Construction">ABC Construction Ltd.</option>
            <option value="TechBuild Engineers">TechBuild Engineers</option>
            <option value="Green Materials">Green Materials Pvt Ltd</option>
            <option value="SafeWorks Services">SafeWorks Services</option>
            <option value="PowerGrid Solutions">PowerGrid Solutions</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Categories">All Categories</option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
            <option value="Materials">Materials</option>
            <option value="Services">Services</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedBU}
            onChange={(e) => setSelectedBU(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Business Units">All Business Units</option>
            <option value="Infra - Roads">Infra - Roads</option>
            <option value="Power & Transmission">Power & Transmission</option>
            <option value="Hydro & Irrigation">Hydro & Irrigation</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="Sep 2026">Sep 2026</option>
            <option value="Aug 2026">Aug 2026</option>
            <option value="Jul 2026">Jul 2026</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Projects">All Projects</option>
            <option value="Road Project">Road Project (Zojila)</option>
            <option value="Metro Phase 1">Metro Phase 1</option>
            <option value="Plant Expansion">Plant Expansion</option>
            <option value="Refinery">Refinery</option>
            <option value="Transmission">Transmission Corridor</option>
          </select>
        </div>
      </div>

      {/* ──── Transactions Table ──── */}
      <div className="proc-glass-card" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="proc-table-wrapper">
          <table className="proc-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Category</th>
                <th>Project</th>
                <th>Amount (₹)</th>
                <th>Local</th>
                <th>MSME</th>
                <th>Source</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 800, color: '#2563EB', fontFamily: 'monospace' }}>
                    {t.id}
                  </td>
                  <td><span style={{ fontSize: '12px', color: '#64748B' }}>{t.date}</span></td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{t.supplier}</span>
                  </td>
                  <td><span style={{ fontSize: '12px', color: '#334155', fontWeight: 600 }}>{t.category}</span></td>
                  <td><span style={{ fontSize: '12px', color: '#475569' }}>{t.project}</span></td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '13px' }}>
                      {t.amount}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: t.local === 'Yes' ? 'rgba(5, 150, 105, 0.1)' : '#F1F5F9',
                        color: t.local === 'Yes' ? '#059669' : '#64748B'
                      }}
                    >
                      {t.local}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: t.msme === 'Yes' ? 'rgba(124, 58, 237, 0.1)' : '#F1F5F9',
                        color: t.msme === 'Yes' ? '#7C3AED' : '#64748B'
                      }}
                    >
                      {t.msme}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                      {t.source}
                    </span>
                  </td>
                  <td>{getStatusChip(t.status)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedTx(t)}
                      title="View Transaction"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        background: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2563EB'
                      }}
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Showing <strong>1 to {filteredTransactions.length}</strong> of <strong>248 transactions</strong>
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button type="button" className="proc-page-btn" disabled>
              <ChevronLeft size={14} />
            </button>
            <button type="button" className="proc-page-btn active">1</button>
            <button type="button" className="proc-page-btn">2</button>
            <button type="button" className="proc-page-btn">3</button>
            <span style={{ color: '#94A3B8', fontSize: '12px' }}>...</span>
            <button type="button" className="proc-page-btn">50</button>
            <button type="button" className="proc-page-btn">
              <ChevronRight size={14} />
            </button>
            <select
              style={{
                marginLeft: '8px',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '11.5px',
                color: '#475569',
                background: '#FFFFFF'
              }}
            >
              <option>10 / page</option>
              <option>25 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Import Feedback Toast */}
      {importFeedback && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0F172A', color: '#FFF', padding: '12px 18px', borderRadius: 10, fontSize: '12.5px', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 9999 }}>
          ✔ {importFeedback}
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 480, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className="proc-status-chip active">{selectedTx.status}</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{selectedTx.id} - ERP Voucher</h3>
              </div>
              <button onClick={() => setSelectedTx(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: 14, borderRadius: 10 }}>
              <div><strong>Supplier:</strong> {selectedTx.supplier}</div>
              <div><strong>Category:</strong> {selectedTx.category}</div>
              <div><strong>Amount:</strong> {selectedTx.amount}</div>
              <div><strong>Scope 3 Carbon:</strong> {selectedTx.carbon}</div>
              <div><strong>Project Site:</strong> {selectedTx.project}</div>
              <div><strong>Invoice Date:</strong> {selectedTx.date}</div>
              <div style={{ gridColumn: 'span 2' }}><strong>Data Source:</strong> {selectedTx.source} (Synced via SAP ERP)</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 20 }}>
              <button
                type="button"
                className="proc-btn proc-btn-outline"
                onClick={() => setSelectedTx(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
