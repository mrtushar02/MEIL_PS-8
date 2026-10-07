import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Key, 
  Building, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { api } from '../../../services/api';

export default function AdminCreateUserModal({
  roles = [],
  onClose,
  onUserCreated
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    employee_id: '',
    department: 'Corporate Governance & ESG',
    role_id: roles[0]?.id || 'role-site',
    scope_type: 'GROUP',
    scope_id: 'meil-group-hq',
    password: 'password123'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const steps = [
    { num: 1, title: 'Identity', desc: 'Personal details' },
    { num: 2, title: 'Role Assignment', desc: 'Select canonical role' },
    { num: 3, title: 'Organization Scope', desc: 'Entity boundary' },
    { num: 4, title: 'Access & Perms', desc: 'Derived security rights' },
    { num: 5, title: 'Review & Confirm', desc: 'Final audit check' }
  ];

  const selectedRoleObj = roles.find(r => r.id === formData.role_id) || roles[0];

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.full_name.trim() || !formData.email.trim()) {
        setError('Full Name and Email Address are required.');
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.createAdminUser(formData);
      onUserCreated && onUserCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="admin-modal-header">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Create Enterprise User
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Multi-step cryptographic identity provisioning
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={16} color="#64748B" />
          </button>
        </div>

        {/* Modal Body: Left Step Wizard + Right Content */}
        <div className="admin-modal-body">
          {/* Left Vertical Stepper */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderRight: '1px solid #E2E8F0', paddingRight: '16px' }}>
            {steps.map((s) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;
              return (
                <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isCurrent ? '#2563EB' : isDone ? '#16A34A' : '#E2E8F0',
                    color: isCurrent || isDone ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {isDone ? <Check size={14} /> : s.num}
                  </div>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: isCurrent ? '700' : '600', color: isCurrent ? '#2563EB' : '#334155' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
                {error}
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#0F172A' }}>Step 1: User Identity</h4>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Anand Mahindra V."
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="admin-search-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="e.g. anand.m@meilgroup.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="admin-search-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>Employee / Reference ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. MEIL-EMP-2041"
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    className="admin-search-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>Department</label>
                  <input 
                    type="text" 
                    placeholder="Corporate Governance & ESG"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="admin-search-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#0F172A' }}>Step 2: Role Assignment</h4>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                  Select one of the 15 canonical enterprise governance roles.
                </p>
                <select 
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                  className="admin-select"
                  style={{ width: '100%', padding: '10px' }}
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.code})
                    </option>
                  ))}
                </select>

                {selectedRoleObj && (
                  <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{selectedRoleObj.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>{selectedRoleObj.description}</div>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <span className="admin-badge admin-badge-purple">{selectedRoleObj.code}</span>
                      <span className="admin-badge admin-badge-blue">{selectedRoleObj.scope_type}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#0F172A' }}>Step 3: Organization Scope</h4>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                  Define the spatial data boundary and jurisdictional tier for this account.
                </p>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>Scope Level</label>
                  <select 
                    value={formData.scope_type}
                    onChange={(e) => setFormData({ ...formData, scope_type: e.target.value })}
                    className="admin-select"
                    style={{ width: '100%' }}
                  >
                    <option value="GROUP">GROUP (Enterprise-wide)</option>
                    <option value="SUBSIDIARY">SUBSIDIARY (e.g. MEIL Core Infrastructure)</option>
                    <option value="BUSINESS_UNIT">BUSINESS_UNIT (e.g. Tunnels BU, Water BU)</option>
                    <option value="PROJECT">PROJECT (Site-level, e.g. Zojila Tunnel)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>Target Scope Entity ID</label>
                  <input 
                    type="text" 
                    value={formData.scope_id}
                    onChange={(e) => setFormData({ ...formData, scope_id: e.target.value })}
                    className="admin-search-input"
                    style={{ width: '100%' }}
                  />
                  <span style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '3px', display: 'block' }}>
                    Defaults to &quot;meil-group-hq&quot; or project/BU reference ID
                  </span>
                </div>
              </div>
            )}

            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#0F172A' }}>Step 4: Derived Permissions</h4>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                  Strict RBAC prevents privilege escalation. Permissions are inherited from canonical role.
                </p>

                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '10px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  {(selectedRoleObj?.permissions || ['esg:data_read', 'esg:audit_read']).map(p => (
                    <span key={p} className="admin-badge admin-badge-blue" style={{ fontSize: '10.5px' }}>
                      <Check size={10} /> {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#0F172A' }}>Step 5: Review & Confirm</h4>
                <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                  <div><span style={{ color: '#64748B' }}>Full Name:</span> <strong>{formData.full_name}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Email:</span> <strong>{formData.email}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Assigned Role:</span> <strong style={{ color: '#2563EB' }}>{selectedRoleObj?.name}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Scope:</span> <strong>{formData.scope_type}: {formData.scope_id}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Initial Password:</span> <code>password123</code></div>
                </div>
                <div style={{ fontSize: '11px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} /> An immutable audit log entry will be permanently written to the hash chain.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="admin-modal-footer">
          {step > 1 && (
            <button 
              type="button" 
              className="admin-btn admin-btn-secondary"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}

          {step < 5 ? (
            <button 
              type="button" 
              className="admin-btn admin-btn-primary"
              onClick={handleNext}
            >
              Next <ArrowRight size={14} />
            </button>
          ) : (
            <button 
              type="button" 
              className="admin-btn admin-btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating User...' : 'Provision User Credentials'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
