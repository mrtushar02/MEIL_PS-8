import React, { useState } from 'react';
import {
  ShieldAlert
} from 'lucide-react';

export default function ReportIncidentModal({
  isOpen,
  onClose,
  onSubmit
}) {
  const [projectName, setProjectName] = useState('Zojila Tunnel Project');
  const [location, setLocation] = useState('Portal 2 - East Shaft');
  const [type, setType] = useState('Near Miss');
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  const [peopleAffected, setPeopleAffected] = useState(0);
  const [injury, setInjury] = useState(false);
  const [lti, setLti] = useState(false);
  const [fatality, setFatality] = useState(false);
  const [immediateAction, setImmediateAction] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [responsibleOwner, setResponsibleOwner] = useState('Rajeshwar K.');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [incidentTime, setIncidentTime] = useState('10:30 AM');
  const [fileName, setFileName] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!description.trim()) {
      setValidationError('Please provide a detailed incident description.');
      return;
    }
    if (!responsibleOwner.trim()) {
      setValidationError('Please specify a responsible owner for this event.');
      return;
    }

    onSubmit?.({
      project_name: projectName,
      location,
      type,
      severity,
      description,
      people_affected: parseInt(peopleAffected, 10) || 0,
      injury,
      lti,
      fatality,
      immediate_action: immediateAction,
      root_cause: rootCause,
      corrective_action: correctiveAction,
      responsible_owner: responsibleOwner,
      incident_date: incidentDate,
      incident_time: incidentTime,
      evidence_ref: fileName ? `EVD-${Date.now().toString().slice(-4)}` : null
    });

    onClose();
  };

  return (
    <div className="ehs-modal-backdrop" onClick={onClose}>
      <div className="ehs-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="ehs-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Log Safety Incident / Near-Miss Event
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                Formal entry under DGMS regulations & SEBI BRSR Principle 6 safety requirements.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="ehs-modal-body">
            {validationError && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#B91C1C', fontSize: '12.5px' }}>
                {validationError}
              </div>
            )}

            <div className="ehs-form-row">
              <div className="ehs-form-group">
                <label className="ehs-form-label">Project / Site <span className="required">*</span></label>
                <select className="ehs-form-select" value={projectName} onChange={(e) => setProjectName(e.target.value)}>
                  <option value="Zojila Tunnel Project">Zojila Tunnel Project</option>
                  <option value="Hyderabad Metro Phase 2 Extension">Hyderabad Metro Phase 2</option>
                  <option value="Olectra EV Mega Plant - Phase 1">Olectra EV Mega Plant - Phase 1</option>
                  <option value="Polavaram Dam Project">Polavaram Dam Project</option>
                  <option value="Megha Gas CGD Network - Krishna">Megha Gas CGD Network - Krishna</option>
                </select>
              </div>

              <div className="ehs-form-group">
                <label className="ehs-form-label">Specific Location / Station <span className="required">*</span></label>
                <input 
                  type="text" 
                  className="ehs-form-input" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="ehs-form-row">
              <div className="ehs-form-group">
                <label className="ehs-form-label">Event Category / Type <span className="required">*</span></label>
                <select className="ehs-form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Near Miss">Near Miss (Hazard Avoided)</option>
                  <option value="Injury">Minor Injury (First-Aid)</option>
                  <option value="Incident">Property / Equipment Damage</option>
                  <option value="Safety Observation">Unsafe Condition Observation</option>
                  <option value="Environmental Incident">Environmental Containment Incident</option>
                </select>
              </div>

              <div className="ehs-form-group">
                <label className="ehs-form-label">Severity Level <span className="required">*</span></label>
                <select className="ehs-form-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                  <option value="Low">Low (No Lost Time)</option>
                  <option value="Medium">Medium (First-aid / Repair needed)</option>
                  <option value="High">High (Potential Serious Hazard)</option>
                  <option value="Critical">Critical (Statutory Escalation)</option>
                </select>
              </div>
            </div>

            <div className="ehs-form-group">
              <label className="ehs-form-label">Factual Description of Event <span className="required">*</span></label>
              <textarea 
                className="ehs-form-textarea" 
                rows={3}
                placeholder="State what occurred, equipment involved, and preliminary findings..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* People & Injury Classification */}
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                Statutory Injury Classification
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#475569' }}>People Affected:</label>
                  <input 
                    type="number" 
                    className="ehs-form-input" 
                    min={0}
                    value={peopleAffected}
                    onChange={(e) => setPeopleAffected(e.target.value)}
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#1E293B', cursor: 'pointer' }}>
                  <input type="checkbox" checked={injury} onChange={(e) => setInjury(e.target.checked)} />
                  <span>Injury Incurred</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#1E293B', cursor: 'pointer' }}>
                  <input type="checkbox" checked={lti} onChange={(e) => setLti(e.target.checked)} />
                  <span>Lost-Time Injury (&gt;48h)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#DC2626', cursor: 'pointer', fontWeight: 700 }}>
                  <input type="checkbox" checked={fatality} onChange={(e) => setFatality(e.target.checked)} />
                  <span>Fatality</span>
                </label>
              </div>
            </div>

            <div className="ehs-form-row">
              <div className="ehs-form-group">
                <label className="ehs-form-label">Immediate Action Taken</label>
                <input 
                  type="text" 
                  className="ehs-form-input"
                  placeholder="e.g. Work suspended, area cordoned off..."
                  value={immediateAction}
                  onChange={(e) => setImmediateAction(e.target.value)}
                />
              </div>

              <div className="ehs-form-group">
                <label className="ehs-form-label">Responsible Lead / Owner <span className="required">*</span></label>
                <input 
                  type="text" 
                  className="ehs-form-input"
                  value={responsibleOwner}
                  onChange={(e) => setResponsibleOwner(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="ehs-form-row">
              <div className="ehs-form-group">
                <label className="ehs-form-label">Incident Date <span className="required">*</span></label>
                <input 
                  type="date" 
                  className="ehs-form-input"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  required
                />
              </div>

              <div className="ehs-form-group">
                <label className="ehs-form-label">Incident Time</label>
                <input 
                  type="text" 
                  className="ehs-form-input"
                  value={incidentTime}
                  onChange={(e) => setIncidentTime(e.target.value)}
                />
              </div>
            </div>

            <div className="ehs-form-group">
              <label className="ehs-form-label">Attach Preliminary Photographic or Acoustic Evidence</label>
              <input 
                type="file" 
                className="ehs-form-input"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFileName(e.target.files[0].name);
                }}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="ehs-modal-footer">
            <button 
              type="button" 
              className="ehs-btn ehs-btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="ehs-btn ehs-btn-primary"
            >
              Submit Official Incident Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
