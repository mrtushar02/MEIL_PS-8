import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { exportToCsv, triggerFileInput } from '../../../../utils/exportUtils';

export default function SupplierDirectoryScreen({
  suppliers = [],
  onNavigateTab,
  onSelectSupplier,
  onOpenAddSupplier
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [currentPage, setCurrentPage] = useState(1);
  const [importFeedback, setImportFeedback] = useState(null);

  // Filtered suppliers
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All Categories' || s.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All Status' || s.status === selectedStatus;
    const matchesLocation =
      selectedLocation === 'All Locations' || s.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  const getEsgStatusChip = (status) => {
    switch (status) {
      case 'Assessed':
        return <span className="proc-status-chip active">Assessed</span>;
      case 'Pending':
        return <span className="proc-status-chip pending">Pending</span>;
      case 'In Progress':
        return <span className="proc-status-chip in-progress">In Progress</span>;
      case 'Not Assessed':
      default:
        return <span className="proc-status-chip not-started">Not Assessed</span>;
    }
  };

  const getRiskChip = (risk) => {
    switch (risk) {
      case 'Critical':
        return <span className="proc-status-chip critical">Critical</span>;
      case 'High':
        return <span className="proc-status-chip high">High</span>;
      case 'Medium':
        return <span className="proc-status-chip medium">Medium</span>;
      case 'Low':
      default:
        return <span className="proc-status-chip low">Low</span>;
    }
  };

  const handleRowClick = (supplier) => {
    onSelectSupplier?.(supplier);
    onNavigateTab?.('supplier-detail');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── Header & Top Action Controls ──── */}
      <div className="proc-glass-card" style={{ padding: '16px 20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Suppliers
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
              Manage suppliers and their procurement and ESG information.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="proc-btn proc-btn-blue"
              onClick={onOpenAddSupplier}
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
            >
              <Plus size={15} />
              <span>Add Supplier</span>
            </button>
            <button
              type="button"
              className="proc-btn proc-btn-outline"
              style={{ padding: '7px 12px', fontSize: '12.5px' }}
              onClick={() => triggerFileInput((file) => {
                setImportFeedback(`Template received: ${file.name} (${(file.size / 1024).toFixed(1)} KB). Vendor records imported successfully!`);
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
              onClick={() => exportToCsv('MEIL_Suppliers_Directory.csv', suppliers)}
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <div className="proc-search-bar" style={{ minWidth: '280px' }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search by supplier name, code, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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
            <option value="Logistics">Logistics</option>
            <option value="Equipment">Equipment</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Locations">All Locations</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Chennai">Chennai</option>
            <option value="Pune">Pune</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Ahmedabad">Ahmedabad</option>
          </select>
        </div>
      </div>

      {/* ──── Data Table Container ──── */}
      <div className="proc-glass-card" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="proc-table-wrapper">
          <table className="proc-table">
            <thead>
              <tr>
                <th>Supplier Code</th>
                <th>Supplier Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>MSME</th>
                <th>Local</th>
                <th>ESG Status</th>
                <th>Risk</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((s) => (
                <tr
                  key={s.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(s)}
                >
                  <td style={{ fontWeight: 800, color: '#2563EB', fontFamily: 'monospace' }}>
                    {s.code}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{s.name}</span>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>{s.bu}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                      {s.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{s.location}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: s.msme === 'Yes' ? 'rgba(124, 58, 237, 0.1)' : '#F1F5F9',
                        color: s.msme === 'Yes' ? '#7C3AED' : '#64748B'
                      }}
                    >
                      {s.msme}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: s.local === 'Yes' ? 'rgba(5, 150, 105, 0.1)' : '#F1F5F9',
                        color: s.local === 'Yes' ? '#059669' : '#64748B'
                      }}
                    >
                      {s.local}
                    </span>
                  </td>
                  <td>{getEsgStatusChip(s.esgStatus)}</td>
                  <td>{getRiskChip(s.risk)}</td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: s.status === 'Active' ? 'rgba(5, 150, 105, 0.12)' : '#F1F5F9',
                        color: s.status === 'Active' ? '#059669' : '#94A3B8'
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleRowClick(s)}
                        title="View Supplier Profile"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid #E2E8F0',
                          background: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#2563EB'
                        }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectSupplier(s);
                          onNavigateTab?.('supplier-detail');
                        }}
                        title="Edit / View Supplier"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid #E2E8F0',
                          background: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#64748B'
                        }}
                      >
                        <Edit size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Showing <strong>1 to {filteredSuppliers.length}</strong> of <strong>486 suppliers</strong>
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              className="proc-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft size={14} />
            </button>
            <button type="button" className="proc-page-btn active">1</button>
            <button type="button" className="proc-page-btn">2</button>
            <button type="button" className="proc-page-btn">3</button>
            <button type="button" className="proc-page-btn">4</button>
            <button type="button" className="proc-page-btn">5</button>
            <span style={{ color: '#94A3B8', fontSize: '12px' }}>...</span>
            <button type="button" className="proc-page-btn">61</button>
            <button type="button" className="proc-page-btn" onClick={() => setCurrentPage(currentPage + 1)}>
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
              <option>50 / page</option>
            </select>
          </div>
        </div>
      </div>

      {importFeedback && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0F172A', color: '#FFF', padding: '12px 18px', borderRadius: 10, fontSize: '12.5px', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 9999 }}>
          ✔ {importFeedback}
        </div>
      )}
    </div>
  );
}
