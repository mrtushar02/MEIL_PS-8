import React, { useState, useMemo } from 'react';
import {
  X,
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  Cpu,
  Flame,
  Zap,
  Droplets,
  Trash2,
  Send,
  Building2,
  Radio,
  Clock,
  Edit2,
  Check
} from 'lucide-react';

export default function SiteTeamManagementModal({
  isOpen,
  onClose,
  project = { id: 'site-102', name: 'Zojila Tunnel Project (PKG-2)' }
}) {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 'tm-1',
      name: 'Rohit Kumar',
      empId: 'MEIL-ENG-1082',
      role: 'Site Lead & ESG In-Charge',
      department: 'Site Operations & ESG',
      email: 'rohit.kumar@meilgroup.in',
      phone: '+91 98490 23145',
      channel: 'Radio VHF Ch-4',
      status: 'Active On-Site',
      statusColor: '#16A34A',
      assignedModules: ['Fuel & Scope 1', 'Grid Scope 2', 'Quarterly BRSR Submission'],
      avatar: '/avatar_rohit.jpg',
      shift: 'General Day Shift'
    },
    {
      id: 'tm-2',
      name: 'K. Venkat',
      empId: 'MEIL-MEC-2194',
      role: 'Plant & Heavy Fleet Lead',
      department: 'Mechanical Engineering',
      email: 'venkat.k@meilgroup.in',
      phone: '+91 97012 34567',
      channel: 'Radio VHF Ch-2',
      status: 'Active On-Site',
      statusColor: '#16A34A',
      assignedModules: ['DG Fleet Fuel Calibration', '33kV Substation Feeder'],
      avatar: '/avatar_reviewer.jpg',
      shift: 'Morning Shift A'
    },
    {
      id: 'tm-3',
      name: 'Priyanka S.',
      empId: 'MEIL-ENV-3401',
      role: 'EHS Environmental Specialist',
      department: 'Environment & Water',
      email: 'priyanka.s@meilgroup.in',
      phone: '+91 99887 65432',
      channel: 'Radio VHF Ch-5',
      status: 'Active On-Site',
      statusColor: '#16A34A',
      assignedModules: ['STP Water Treatment', 'ZLD Circularity', 'Hazardous Waste'],
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      shift: 'General Day Shift'
    },
    {
      id: 'tm-4',
      name: 'Jitendra Roy',
      empId: 'MEIL-HSE-4512',
      role: 'Chief Safety Officer (HSE)',
      department: 'Safety & HSE',
      email: 'jitendra.roy@meilgroup.in',
      phone: '+91 98765 43210',
      channel: 'Radio VHF Ch-1 (Emergency)',
      status: 'Active On-Site',
      statusColor: '#16A34A',
      assignedModules: ['Safe Man-Hours Tracking', 'Daily Toolbox Talks', 'Zero-Harm Audit'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      shift: 'Rotation 24x7'
    },
    {
      id: 'tm-5',
      name: 'Anil Verma',
      empId: 'MEIL-ELE-5620',
      role: 'Electrical Substation Engineer',
      department: 'Electrical Engineering',
      email: 'anil.verma@meilgroup.in',
      phone: '+91 94401 23456',
      channel: 'Radio VHF Ch-3',
      status: 'Shift 1 Duty',
      statusColor: '#2563EB',
      assignedModules: ['Smart Meters Telemetry', 'CEA Grid Factor Ingestion'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      shift: 'Morning Shift A'
    },
    {
      id: 'tm-6',
      name: 'Manoj Tiwari',
      empId: 'MEIL-LOG-6731',
      role: 'Fuel & Materials Custodian',
      department: 'Supply Chain & Logistics',
      email: 'manoj.tiwari@meilgroup.in',
      phone: '+91 98123 45678',
      channel: 'Radio VHF Ch-6',
      status: 'Shift 2 Duty',
      statusColor: '#D97706',
      assignedModules: ['IOCL Fuel Inflow Tankers', 'SPCB Form 10 Consignments'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      shift: 'Afternoon Shift B'
    },
    {
      id: 'tm-7',
      name: 'Sneha Patil',
      empId: 'MEIL-QA-7840',
      role: 'QA Testing & Calibration Lead',
      department: 'Quality & Testing',
      email: 'sneha.patil@meilgroup.in',
      phone: '+91 98901 23456',
      channel: 'Radio VHF Ch-4',
      status: 'Active On-Site',
      statusColor: '#16A34A',
      assignedModules: ['NABL Water Testing', 'Stack Emission Monitoring'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      shift: 'General Day Shift'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [messagingMember, setMessagingMember] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messageSentNotice, setMessageSentNotice] = useState(null);

  // New member form state
  const [newMember, setNewMember] = useState({
    name: '',
    empId: '',
    role: '',
    department: 'Site Operations & ESG',
    email: '',
    phone: '',
    channel: 'Radio VHF Ch-4',
    shift: 'General Day Shift',
    assignedModule: 'Fuel & Scope 1'
  });

  // Reassign modal state
  const [editingMember, setEditingMember] = useState(null);
  const [editModuleInput, setEditModuleInput] = useState('');

  // Department list
  const departments = ['All', 'Site Operations & ESG', 'Mechanical Engineering', 'Environment & Water', 'Safety & HSE', 'Electrical Engineering', 'Supply Chain & Logistics', 'Quality & Testing'];

  // Filtered members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((m) => {
      if (selectedDept !== 'All' && m.department !== selectedDept) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchRole = m.role.toLowerCase().includes(q);
        const matchEmp = m.empId.toLowerCase().includes(q);
        const matchModule = m.assignedModules.some(mod => mod.toLowerCase().includes(q));
        if (!matchName && !matchRole && !matchEmp && !matchModule) {
          return false;
        }
      }
      return true;
    });
  }, [teamMembers, selectedDept, searchQuery]);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role) return;

    const created = {
      id: `tm-${Date.now()}`,
      name: newMember.name,
      empId: newMember.empId || `MEIL-ENG-${Math.floor(1000 + Math.random() * 9000)}`,
      role: newMember.role,
      department: newMember.department,
      email: newMember.email || `${newMember.name.toLowerCase().replace(/\s+/g, '.')}@meilgroup.in`,
      phone: newMember.phone || '+91 98000 00000',
      channel: newMember.channel,
      status: 'Active On-Site',
      statusColor: '#16A34A',
      assignedModules: [newMember.assignedModule],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      shift: newMember.shift
    };

    setTeamMembers(prev => [created, ...prev]);
    setIsAddMemberOpen(false);
    setNewMember({
      name: '',
      empId: '',
      role: '',
      department: 'Site Operations & ESG',
      email: '',
      phone: '',
      channel: 'Radio VHF Ch-4',
      shift: 'General Day Shift',
      assignedModule: 'Fuel & Scope 1'
    });
    setMessageSentNotice(`Successfully added ${created.name} to the Site Personnel Roster.`);
    setTimeout(() => setMessageSentNotice(null), 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setMessageSentNotice(`Operational directive dispatched to ${messagingMember.name} (${messagingMember.channel}): "${messageText}"`);
    setMessageText('');
    setMessagingMember(null);
    setTimeout(() => setMessageSentNotice(null), 3500);
  };

  const handleSaveModules = (memberId) => {
    if (!editModuleInput.trim()) return;
    setTeamMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          assignedModules: [...new Set([...m.assignedModules, editModuleInput.trim()])]
        };
      }
      return m;
    }));
    setEditingMember(null);
    setEditModuleInput('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '960px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%)',
        backdropFilter: 'blur(30px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(186, 230, 253, 0.5)',
        overflow: 'hidden',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          background: 'linear-gradient(90deg, rgba(240, 249, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}>
              <Users size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Site Team & Personnel Management
                </h3>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: '#2563EB',
                  background: 'rgba(37, 99, 235, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(37, 99, 235, 0.2)'
                }}>
                  {teamMembers.length} Supervisory Leads
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                {project.name || 'Zojila Tunnel PKG-2'} • ESG Data Owners & Field Telemetry Supervisors
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsAddMemberOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
              }}
            >
              <UserPlus size={14} />
              <span>Add Member</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(241, 245, 249, 0.8)',
                border: '1px solid rgba(203, 213, 225, 0.6)',
                borderRadius: '10px',
                cursor: 'pointer',
                padding: '6px',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 4 Stat Strip Pods */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          padding: '12px 24px',
          background: 'rgba(248, 250, 252, 0.7)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.7)'
        }}>
          <div style={{ padding: '8px 12px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Active Headcount</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>86 Deployed</div>
            <div style={{ fontSize: '9.5px', color: '#16A34A', fontWeight: 600 }}>100% Present Today</div>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Zero-Harm Safety</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#16A34A' }}>45,000 hrs</div>
            <div style={{ fontSize: '9.5px', color: '#64748B' }}>0 Fatalities / 0 LTI</div>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>ESG Data Owners</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#2563EB' }}>{teamMembers.length} Leads</div>
            <div style={{ fontSize: '9.5px', color: '#2563EB', fontWeight: 600 }}>5 Modules Covered</div>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Radio Comms</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0284C7' }}>VHF Ready</div>
            <div style={{ fontSize: '9.5px', color: '#64748B' }}>6 Active Channels</div>
          </div>
        </div>

        {/* Notice alert */}
        {messageSentNotice && (
          <div style={{
            margin: '10px 24px 0',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(240, 253, 244, 0.95)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            color: '#166534',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} color="#16A34A" />
            <span>{messageSentNotice}</span>
          </div>
        )}

        {/* Filter Bar */}
        <div style={{
          padding: '12px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(226, 232, 240, 0.7)'
        }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by name, role, module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 32px',
                borderRadius: '10px',
                border: '1px solid rgba(203, 213, 225, 0.8)',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {departments.slice(0, 5).map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: selectedDept === dept ? '1px solid #2563EB' : '1px solid rgba(226, 232, 240, 0.8)',
                  background: selectedDept === dept ? 'rgba(37, 99, 235, 0.1)' : '#FFFFFF',
                  color: selectedDept === dept ? '#2563EB' : '#64748B',
                  fontWeight: selectedDept === dept ? 700 : 500,
                  fontSize: '11px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Member Cards Grid */}
        <div style={{
          padding: '20px 24px',
          overflowY: 'auto',
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '14px'
        }}>
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                gap: '12px'
              }}
            >
              {/* Member Top Identity */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(37, 99, 235, 0.2)'
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {member.name}
                      </h4>
                      <span style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        color: member.statusColor,
                        background: `${member.statusColor}14`,
                        padding: '1.5px 6px',
                        borderRadius: '6px'
                      }}>
                        {member.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#2563EB', marginTop: '1px' }}>
                      {member.role}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>
                      {member.empId} • {member.department}
                    </div>
                  </div>
                </div>

                {/* Scoped Responsibilities */}
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>
                    Assigned ESG Modules:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {member.assignedModules.map((mod, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: '#334155',
                          background: '#F1F5F9',
                          padding: '2px 7px',
                          borderRadius: '6px',
                          border: '1px solid rgba(203, 213, 225, 0.6)'
                        }}
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Comms Strip */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '10px',
                  fontSize: '10.5px',
                  color: '#64748B',
                  padding: '6px 8px',
                  background: 'rgba(248, 250, 252, 0.8)',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Radio size={11} color="#0284C7" />
                    <span>{member.channel}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} color="#16A34A" />
                    <span>{member.shift}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(241, 245, 249, 0.9)' }}>
                <button
                  type="button"
                  onClick={() => setMessagingMember(member)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    padding: '6px',
                    borderRadius: '8px',
                    background: 'rgba(37, 99, 235, 0.08)',
                    border: '1px solid rgba(37, 99, 235, 0.2)',
                    color: '#2563EB',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Send size={12} />
                  <span>Send Notice</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingMember(member);
                    setEditModuleInput('');
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#475569',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Edit2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Messaging Composer Overlay */}
        {messagingMember && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(226, 232, 240, 0.8)',
            background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E40AF' }}>
                Dispatch Operational Notice to {messagingMember.name} ({messagingMember.role} • {messagingMember.channel})
              </span>
              <button
                onClick={() => setMessagingMember(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#64748B' }}
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Type operational instruction, calibration notice, or site priority..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid #93C5FD',
                  fontSize: '12.5px',
                  outline: 'none',
                  background: '#FFFFFF'
                }}
                autoFocus
              />
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Send size={13} />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* Reassign Module Overlay */}
        {editingMember && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(226, 232, 240, 0.8)',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
              Assign New Module to <strong>{editingMember.name}</strong>:
            </div>
            <div style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="e.g. Scope 3 Travel, Solar Hybrid, Waste Scrap"
                value={editModuleInput}
                onChange={(e) => setEditModuleInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px'
                }}
              />
              <button
                type="button"
                onClick={() => handleSaveModules(editingMember.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#64748B',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Member Modal Sub-Dialog */}
        {isAddMemberOpen && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 10000
          }}>
            <div style={{
              width: '100%',
              maxWidth: '520px',
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Add Site Team Supervisor
                </h4>
                <button onClick={() => setIsAddMemberOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={18} color="#64748B" />
                </button>
              </div>

              <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Employee ID</label>
                    <input
                      type="text"
                      placeholder="MEIL-ENG-XXXX"
                      value={newMember.empId}
                      onChange={(e) => setNewMember({ ...newMember, empId: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Designation / Role</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Plant Specialist"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Department</label>
                    <select
                      value={newMember.department}
                      onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                    >
                      {departments.filter(d => d !== 'All').map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Assigned ESG Module</label>
                    <select
                      value={newMember.assignedModule}
                      onChange={(e) => setNewMember({ ...newMember, assignedModule: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                    >
                      <option value="Fuel & Scope 1">Fuel & Scope 1</option>
                      <option value="Grid Scope 2">Grid Scope 2</option>
                      <option value="STP Water Recycled">STP Water Recycled</option>
                      <option value="Hazardous Waste & Scrap">Hazardous Waste & Scrap</option>
                      <option value="Safety Zero-Harm">Safety Zero-Harm</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Duty Shift</label>
                    <select
                      value={newMember.shift}
                      onChange={(e) => setNewMember({ ...newMember, shift: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                    >
                      <option value="General Day Shift">General Day Shift</option>
                      <option value="Morning Shift A">Morning Shift A</option>
                      <option value="Afternoon Shift B">Afternoon Shift B</option>
                      <option value="Night Rotation C">Night Rotation C</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddMemberOpen(false)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 20px', borderRadius: '8px', background: '#2563EB', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '12px' }}
                  >
                    Add Member to Roster
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
          background: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Site Personnel Scoped under SEBI BRSR Principle 3 & Principle 6 Governance
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '7px 20px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#0F172A',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close Team View
          </button>
        </div>
      </div>
    </div>
  );
}
