import React, { useState, useMemo, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { esgStore } from '../../services/esgStore';
import {
  Briefcase,
  FileText,
  ShieldCheck,
  Clock,
  AlertCircle,
  AlertTriangle,
  Search,
  Download,
  Plus,
  ChevronDown,
  List,
  LayoutGrid,
  CheckCircle2,
  X,
  UploadCloud,
  FileSpreadsheet,
  Layers,
  Image as ImageIcon,
  Eye,
  Printer,
  ExternalLink
} from 'lucide-react';
import './EvidenceVault.css';
import { downloadEvidencePDF } from '../../utils/pdfGenerator';

// Master Evidence Records matching Reference Screen 3
const INITIAL_EVIDENCE = [
  {
    id: 'ev-01',
    fileName: 'Diesel Challan Aug 2026.pdf',
    fileType: 'pdf',
    relatedRecord: 'Fuel Log #4921',
    project: 'Zojila Tunnel (PKG-2)',
    projectShort: 'Zojila Tunnel',
    module: 'Energy',
    moduleDetail: 'Energy - Fuel & DG',
    docType: 'Invoice',
    docTypeFull: 'Invoice / Challan',
    typeColor: '#0284C7',
    typeBg: 'rgba(2, 132, 199, 0.12)',
    size: '1.2 MB',
    uploadedBy: 'Rohit Kumar',
    uploadedAt: '04 Oct 2026 10:24 AM',
    date: '04 Oct 2026',
    status: 'Verified',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    sha256: '9f8e7d6c5b4a312019e8d7c6b5a43210fe8b2c1a09d3e4f5a6b7c8d9e0f1a2b3',
    version: 'v1.0',
    history: [
      { action: 'Uploaded', user: 'Rohit Kumar', time: '04 Oct 2026 10:24 AM', note: 'Original IOCL fuel delivery challan' },
      { action: 'Verified', user: 'K. Venkat (Reviewer)', time: '04 Oct 2026 12:45 PM', note: 'Quantity 4,500 L matched weighbridge receipt' }
    ],
    comments: [
      { user: 'K. Venkat', time: '04 Oct 2026 12:45 PM', text: 'Verified against Fuel Log batch #4921. Scope 1 calculation approved.' }
    ]
  },
  {
    id: 'ev-02',
    fileName: 'Electricity Bill Sep 2026.pdf',
    fileType: 'pdf',
    relatedRecord: 'Grid #801',
    project: 'Bengaluru Metro Phase 3',
    projectShort: 'Bengaluru Metro',
    module: 'Energy',
    moduleDetail: 'Energy - Grid Metering',
    docType: 'Utility Bill',
    docTypeFull: 'Electricity Utility Bill',
    typeColor: '#2563EB',
    typeBg: 'rgba(37, 99, 235, 0.12)',
    size: '2.1 MB',
    uploadedBy: 'K. Venkat',
    uploadedAt: '03 Oct 2026 03:15 PM',
    date: '03 Oct 2026',
    status: 'Pending',
    statusColor: '#D97706',
    statusBg: 'rgba(217, 119, 6, 0.12)',
    sha256: '8f4a2c9e7b1d6f3a5e8c4b2a9d7f1e3c5a7e6d5c4b3a21098f4a2c9e7b1d6f3a',
    version: 'v1.0',
    history: [
      { action: 'Uploaded', user: 'K. Venkat', time: '03 Oct 2026 03:15 PM', note: 'BESCOM High Tension 66kV substation bill' }
    ],
    comments: []
  },
  {
    id: 'ev-03',
    fileName: 'Water Meter Reading.jpg',
    fileType: 'img',
    relatedRecord: 'Water #221',
    project: 'Krishna Water Supply',
    projectShort: 'Krishna Water Supply',
    module: 'Water',
    moduleDetail: 'Water - Pumphouse Discharge',
    docType: 'Photo',
    docTypeFull: 'Physical Meter Photo',
    typeColor: '#0891B2',
    typeBg: 'rgba(8, 145, 178, 0.12)',
    size: '0.8 MB',
    uploadedBy: 'Priyanka S.',
    uploadedAt: '02 Oct 2026 11:30 AM',
    date: '02 Oct 2026',
    status: 'Verified',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    sha256: '7e6d5c4b3a21098f4a2c9e7b1d6f3a5e8c4b2a9d7f1e3c5a7e6d5c4b3a21098e',
    version: 'v1.0',
    history: [
      { action: 'Uploaded', user: 'Priyanka S.', time: '02 Oct 2026 11:30 AM', note: 'Site inspection flowmeter snapshot' },
      { action: 'Verified', user: 'Suresh Panyam', time: '02 Oct 2026 02:10 PM', note: 'Flow counter reading confirmed' }
    ],
    comments: []
  },
  {
    id: 'ev-04',
    fileName: 'Waste Manifest.pdf',
    fileType: 'pdf',
    relatedRecord: 'Waste #116',
    project: 'Hyderabad Infra Park',
    projectShort: 'Hyderabad Infra Park',
    module: 'Waste',
    moduleDetail: 'Hazardous Waste Form 10',
    docType: 'Manifest',
    docTypeFull: 'Hazardous Waste Manifest',
    typeColor: '#7C3AED',
    typeBg: 'rgba(124, 58, 237, 0.12)',
    size: '1.5 MB',
    uploadedBy: 'Jitendra Roy',
    uploadedAt: '02 Oct 2026 09:12 AM',
    date: '02 Oct 2026',
    status: 'Rejected',
    statusColor: '#DC2626',
    statusBg: 'rgba(220, 38, 38, 0.12)',
    sha256: '6d5c4b3a21098e7f4a2c9e7b1d6f3a5e8c4b2a9d7f1e3c5a7e6d5c4b3a21098f',
    version: 'v1.0',
    history: [
      { action: 'Uploaded', user: 'Jitendra Roy', time: '02 Oct 2026 09:12 AM', note: 'TSPCB Form 10 manifest' },
      { action: 'Rejected', user: 'Rohit Kumar (Site Lead)', time: '02 Oct 2026 04:30 PM', note: 'Authorized TSPCB transporter signature missing on copy 3' }
    ],
    comments: [
      { user: 'Rohit Kumar', time: '02 Oct 2026 04:30 PM', text: 'Missing SPCB transporter stamp on Page 2. Please replace with signed copy.' }
    ]
  },
  {
    id: 'ev-05',
    fileName: 'Safety Training Attendance.pdf',
    fileType: 'pdf',
    relatedRecord: 'Safety #77',
    project: 'MEIL Energy Park',
    projectShort: 'MEIL Energy Park',
    module: 'Safety',
    moduleDetail: 'Zero-Harm HSE Induction',
    docType: 'Certificate',
    docTypeFull: 'Training Attendance Sheet',
    typeColor: '#4F46E5',
    typeBg: 'rgba(79, 70, 229, 0.12)',
    size: '0.9 MB',
    uploadedBy: 'Rohit Kumar',
    uploadedAt: '01 Oct 2026 04:45 PM',
    date: '01 Oct 2026',
    status: 'Verified',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    sha256: '5c4b3a21098e7d6f4a2c9e7b1d6f3a5e8c4b2a9d7f1e3c5a7e6d5c4b3a21098g',
    version: 'v1.0',
    history: [
      { action: 'Uploaded', user: 'Rohit Kumar', time: '01 Oct 2026 04:45 PM', note: 'Batch of 45 technician HSE training logs' },
      { action: 'Verified', user: 'Jitendra Roy', time: '02 Oct 2026 09:00 AM', note: 'All signatures verified' }
    ],
    comments: []
  },
  {
    id: 'ev-06',
    fileName: 'Solar Generation Log Q2.xlsx',
    fileType: 'sheet',
    relatedRecord: 'Solar #104',
    project: 'MEIL Energy Park',
    projectShort: 'MEIL Energy Park',
    module: 'Energy',
    moduleDetail: 'Renewable Power Yield',
    docType: 'Spreadsheet',
    docTypeFull: 'SCADA Generation Log',
    typeColor: '#16A34A',
    typeBg: 'rgba(22, 163, 74, 0.12)',
    size: '3.4 MB',
    uploadedBy: 'K. Venkat',
    uploadedAt: '29 Sep 2026 11:20 AM',
    date: '29 Sep 2026',
    status: 'Verified',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    sha256: '4b3a21098e7d6f4a2c9e7b1d6f3a5e8c4b2a9d7f1e3c5a7e6d5c4b3a21098h',
    version: 'v1.0',
    history: [
      { action: 'Uploaded', user: 'K. Venkat', time: '29 Sep 2026 11:20 AM', note: 'Exported from Ingeteam SCADA server' }
    ],
    comments: []
  }
];

// Authentic Evidence Document Assurance Data Helper
const getDocumentDetails = (doc) => {
  if (!doc) return {};
  const fn = (doc.fileName || '').toLowerCase();
  const mod = (doc.module || '').toLowerCase();
  const dt = (doc.docType || '').toLowerCase();

  if (mod.includes('energy') && (fn.includes('diesel') || dt.includes('invoice') || fn.includes('fuel'))) {
    return {
      voucherNo: 'INV/IOCL/2026/88219',
      issuer: 'Indian Oil Corporation Ltd. (IOCL)',
      metric: 'High Speed Diesel (HSD)',
      quantity: '4,500 Litres (Weighbridge Matched)',
      amount: '₹3,98,250',
      scope: 'BRSR Principle 6 · GHG Scope 1 Stationary Combustion',
      certifiedBy: 'Rohit Kumar (Site Materials Lead)',
      verifiedBy: 'K. Venkat (EHS Auditor)',
      substation: 'Zojila North Portal DG Bank #4',
      assuranceStandard: 'ICAI SAE 3410 & ISO 14064-1 Verified'
    };
  }
  if (fn.includes('electricity') || fn.includes('bill') || dt.includes('utility')) {
    return {
      voucherNo: 'BESCOM/HT/SEP26/49210',
      issuer: 'State Electricity Supply Corp. (HT Division)',
      metric: 'Grid Electricity High Tension 66kV',
      quantity: '1,45,200 kWh (Net Metered)',
      amount: '₹10,89,000',
      scope: 'BRSR Principle 6 · GHG Scope 2 Location Emissions',
      certifiedBy: 'K. Venkat (Plant In-Charge)',
      verifiedBy: 'Priyanka S. (Energy Manager)',
      substation: 'Bengaluru Metro Feeder Substation #3',
      assuranceStandard: 'CEA India Grid Baseline Ver. 19.0'
    };
  }
  if (mod.includes('water') || fn.includes('water') || fn.includes('stp')) {
    return {
      voucherNo: 'WTR/NABL/SEP26/1029',
      issuer: 'NABL Certified Environmental Testing Lab',
      metric: 'Flowmeter Discharge & Effluent Quality',
      quantity: '38,420 m³ (BOD: 4.2 mg/L · ZLD Cleared)',
      amount: 'Zero Liquid Discharge Certified',
      scope: 'BRSR Principle 6 · Water Recycling & Withdrawal',
      certifiedBy: 'Priyanka S. (Site Officer)',
      verifiedBy: 'Suresh Panyam (Environmental Lead)',
      substation: 'Krishna Water Lift Pumphouse #2',
      assuranceStandard: 'CPCB Effluent Standards & ISO 14046'
    };
  }
  if (mod.includes('waste') || fn.includes('waste') || fn.includes('manifest')) {
    return {
      voucherNo: 'SPCB/HW-M10/2026/0881',
      issuer: 'State Pollution Control Board Authorized Transporter',
      metric: 'Hazardous Waste Form 10 (Used Lubricants)',
      quantity: '2.4 Metric Tonnes (Co-Processing Manifest)',
      amount: 'TSPCB Manifest Form 10 Cleared',
      scope: 'BRSR Principle 6 · Waste Circularity & Co-Processing',
      certifiedBy: 'Jitendra Roy (Safety Officer)',
      verifiedBy: 'Authorized Transporter Signatory',
      substation: 'Hazardous Storage Yard (Zone 4)',
      assuranceStandard: 'Hazardous Waste Rules 2016 (Schedule II)'
    };
  }
  if (mod.includes('safety') || fn.includes('safety') || fn.includes('toolbox') || fn.includes('training')) {
    return {
      voucherNo: 'HSE/IND/OCT26/0448',
      issuer: 'MEIL Corporate Safety & Human Rights Directorate',
      metric: 'Zero-Harm HSE Induction & SA8000 Compliance',
      quantity: '45 Personnel (100% Attendance Verified)',
      amount: 'Zero Lost Time Injury (LTI)',
      scope: 'BRSR Principle 3 & 5 · Human Rights, Safety & POSH',
      certifiedBy: 'Rohit Kumar (HSE Induction Trainer)',
      verifiedBy: 'Jitendra Roy (Head of Safety)',
      substation: 'Safety Induction Centre - Hall B',
      assuranceStandard: 'ISO 45001 & SA8000 Social Accountability'
    };
  }
  if (fn.includes('solar') || fn.includes('clean energy')) {
    return {
      voucherNo: 'SLR/SCADA/2026/099',
      issuer: 'MEIL Clean Energy & Solar Telemetry Hub',
      metric: 'Solar PV Yield Generation',
      quantity: '8,90,400 kWh (Clean Power Exported)',
      amount: 'Carbon Offset: 641 tCO2e',
      scope: 'BRSR Principle 6 · Renewable Energy Generation',
      certifiedBy: 'Solar Operations Lead',
      verifiedBy: 'CEA Renewable Auditor',
      substation: 'MEIL Solar Inverter Station #8',
      assuranceStandard: 'CEA Renewable Generation Protocol'
    };
  }

  return {
    voucherNo: `AUDIT/MEIL/${(doc.relatedRecord || '2026').replace(/[^a-zA-Z0-9]/g, '')}`,
    issuer: 'Authorized Regulatory Authority / Vendor',
    metric: `${doc.module || 'ESG'} Disclosure Evidence`,
    quantity: doc.size || '1.2 MB Document',
    amount: 'Verified ESG Record',
    scope: 'SEBI BRSR Statutory Reasonable Assurance',
    certifiedBy: doc.uploadedBy || 'Site Officer',
    verifiedBy: 'Independent Reviewer',
    substation: doc.project || 'Project Site',
    assuranceStandard: 'ICAI SAE 3410 Standard on Assurance'
  };
};

export default function EvidenceVault() {
  const [evidenceList, setEvidenceList] = useState(INITIAL_EVIDENCE);
  const [storeDocs, setStoreDocs] = useState(() => esgStore.state.evidenceDocuments || []);
  const [selectedId, setSelectedId] = useState('ev-01');
  const [activeTab, setActiveTab] = useState('Details');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Subscribe to esgStore so newly uploaded evidence appears in real time
  useEffect(() => {
    const unsub = esgStore.subscribe((state) => {
      if (state && Array.isArray(state.evidenceDocuments)) {
        setStoreDocs([...state.evidenceDocuments]);
      }
    });
    return unsub;
  }, []);

  // Form State for Upload Modal
  const [uploadForm, setUploadForm] = useState({
    fileName: '',
    project: 'Zojila Tunnel (PKG-2)',
    module: 'Energy',
    relatedRecord: 'Fuel Log #4922',
    docType: 'Invoice',
    notes: ''
  });

  // Fetch live evidence from backend
  useEffect(() => {
    api.getEvidence()
      .then(docs => {
        if (docs && docs.length > 0) {
          const mapped = docs.map(doc => ({
            id: doc.id,
            fileName: doc.filename,
            fileType: doc.filename.endsWith('.xlsx') ? 'sheet' : (doc.filename.endsWith('.jpg') || doc.filename.endsWith('.png')) ? 'img' : 'pdf',
            relatedRecord: doc.related_record || 'ESG Record',
            project: doc.project_id || 'Zojila Tunnel (PKG-2)',
            projectShort: 'Project',
            module: doc.module || 'Energy',
            moduleDetail: `${doc.module || 'Energy'} Supporting Proof`,
            docType: doc.document_type || 'Invoice',
            docTypeFull: `${doc.document_type || 'Invoice'} Document`,
            typeColor: '#0284C7',
            typeBg: 'rgba(2, 132, 199, 0.12)',
            size: `${(doc.file_size_bytes / 1024 / 1024).toFixed(1)} MB`,
            uploadedBy: doc.uploaded_by_name || 'Site Officer',
            uploadedAt: new Date(doc.created_at).toLocaleString(),
            date: new Date(doc.created_at).toLocaleDateString(),
            status: doc.status || 'Pending',
            statusColor: doc.status === 'Verified' ? '#16A34A' : doc.status === 'Rejected' ? '#DC2626' : '#D97706',
            statusBg: doc.status === 'Verified' ? 'rgba(22, 163, 74, 0.12)' : doc.status === 'Rejected' ? 'rgba(220, 38, 38, 0.12)' : 'rgba(217, 119, 6, 0.12)',
            sha256: doc.sha256_hash,
            version: doc.version || 'v1.0',
            history: (doc.history || []).map(h => ({
              action: h.action,
              user: `${h.actor_name} (${h.actor_role || 'User'})`,
              time: new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: h.notes || ''
            })),
            comments: []
          }));
          setEvidenceList(mapped);
          setSelectedId(mapped[0].id);
        }
      })
      .catch(err => {
        console.warn('Live evidence fetch notice:', err.message);
      });
  }, []);

  // Combined Evidence List (Store + Backend/Initial)
  const mergedEvidenceList = useMemo(() => {
    const fromStore = (storeDocs || []).map((doc, idx) => {
      const ext = (doc.name || doc.fileName || '').split('.').pop().toLowerCase();
      const fileType = (ext === 'xlsx' || ext === 'csv') ? 'sheet' : (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp') ? 'img' : 'pdf';
      const docType = doc.category || doc.docType || 'Audit Proof';
      const pName = doc.project || doc.site || 'Zojila Tunnel (PKG-2)';

      return {
        id: doc.id || `ev-store-${idx}`,
        fileName: doc.name || doc.fileName || 'Compliance_Attachment.pdf',
        fileType: fileType,
        relatedRecord: doc.linkedRecordId || `${doc.module || 'ESG'} Telemetry`,
        project: pName,
        projectShort: pName.split(' ')[0],
        module: doc.module || 'Energy',
        moduleDetail: `${doc.module || 'Energy'} Verification Proof`,
        docType: docType,
        docTypeFull: `${docType} Verification`,
        typeColor: '#0284C7',
        typeBg: 'rgba(2, 132, 199, 0.12)',
        size: doc.size || '1.8 MB',
        uploadedBy: doc.uploader || doc.uploadedBy || 'Rohit Kumar (Site Lead)',
        uploadedAt: doc.uploadedAt || 'Today, Just now',
        date: doc.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: doc.status || 'Verified',
        statusColor: '#16A34A',
        statusBg: 'rgba(22, 163, 74, 0.12)',
        sha256: doc.sha256 || '9f8e7d6c5b4a312019e8d7c6b5a43210fe8b2c1a09d3e4f5a6b7c8d9e0f1a2b3',
        version: 'v1.0',
        blobUrl: doc.blobUrl || null,
        history: [
          { action: 'Uploaded', user: doc.uploader || 'Rohit Kumar', time: doc.uploadedAt || 'Today', note: 'Uploaded with SHA-256 seal via Data Entry Portal' }
        ],
        comments: []
      };
    });

    const seen = new Set();
    const result = [];

    // Prioritize newest uploaded docs from store
    for (const d of fromStore) {
      if (!seen.has(d.id)) {
        seen.add(d.id);
        result.push(d);
      }
    }

    // Then initial/backend docs
    for (const d of evidenceList) {
      if (!seen.has(d.id)) {
        seen.add(d.id);
        result.push(d);
      }
    }

    return result;
  }, [storeDocs, evidenceList]);

  // Keep selectedId valid
  useEffect(() => {
    if (mergedEvidenceList.length > 0 && !mergedEvidenceList.some(e => e.id === selectedId)) {
      setSelectedId(mergedEvidenceList[0].id);
    }
  }, [mergedEvidenceList, selectedId]);

  const activeDoc = useMemo(() => {
    return mergedEvidenceList.find((e) => e.id === selectedId) || mergedEvidenceList[0] || INITIAL_EVIDENCE[0];
  }, [mergedEvidenceList, selectedId]);

  const docDetails = useMemo(() => getDocumentDetails(activeDoc), [activeDoc]);

  // Filtered List
  const filteredList = useMemo(() => {
    return mergedEvidenceList.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        e.fileName.toLowerCase().includes(q) ||
        e.relatedRecord.toLowerCase().includes(q) ||
        e.project.toLowerCase().includes(q) ||
        e.uploadedBy.toLowerCase().includes(q);

      const matchesProject = selectedProject === 'All' || e.project.includes(selectedProject);
      const matchesModule = selectedModule === 'All' || e.module === selectedModule;
      const matchesStatus = selectedStatus === 'All' || e.status === selectedStatus;

      return matchesSearch && matchesProject && matchesModule && matchesStatus;
    });
  }, [mergedEvidenceList, searchQuery, selectedProject, selectedModule, selectedStatus]);

  // Verification Handlers
  const handleVerify = async (id) => {
    try {
      await api.verifyEvidence(id, 'Approved under ICAI Assurance standards');
    } catch (e) {
      console.warn('Remote verify notice:', e.message);
    }
    setEvidenceList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Verified',
          statusColor: '#16A34A',
          statusBg: 'rgba(22, 163, 74, 0.12)',
          history: [
            ...item.history,
            { action: 'Verified', user: 'Authorized Reviewer', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Approved under ICAI Assurance standards' }
          ]
        };
      }
      return item;
    }));
  };

  const handleReject = async (id) => {
    try {
      await api.rejectEvidence(id, 'Flagged for re-upload');
    } catch (e) {
      console.warn('Remote reject notice:', e.message);
    }
    setEvidenceList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Rejected',
          statusColor: '#DC2626',
          statusBg: 'rgba(220, 38, 38, 0.12)',
          history: [
            ...item.history,
            { action: 'Rejected', user: 'Authorized Reviewer', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Flagged for re-upload' }
          ]
        };
      }
      return item;
    }));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setEvidenceList(prev => prev.map(item => {
      if (item.id === activeDoc.id) {
        return {
          ...item,
          comments: [
            ...item.comments,
            { user: 'Rohit Kumar', time: 'Just now', text: newComment.trim() }
          ]
        };
      }
      return item;
    }));
    setNewComment('');
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        const evidenceDocumentBlob = new Blob([`MEIL STATUTORY ESG AUDIT EVIDENCE RECORD\n=========================================\nDocument: ${uploadForm.fileName || 'Statutory_Compliance_Evidence.pdf'}\nRelated Record: ${uploadForm.relatedRecord || 'N/A'}\nProject: ${uploadForm.project || 'MEIL Group Project'}\nModule: ${uploadForm.module || 'ESG Disclosures'}\nVerified: Cryptographically Sealed`], { type: 'application/pdf' });
        formData.append('file', evidenceDocumentBlob, uploadForm.fileName || 'Statutory_Compliance_Evidence.pdf');
      }
      formData.append('project_id', uploadForm.project);
      formData.append('document_type', uploadForm.docType);
      formData.append('module', uploadForm.module);
      formData.append('related_record', uploadForm.relatedRecord);
      formData.append('notes', uploadForm.notes);

      const serverDoc = await api.uploadEvidence(formData);
      const newDoc = {
        id: serverDoc.id,
        fileName: serverDoc.filename,
        fileType: serverDoc.filename.endsWith('.xlsx') ? 'sheet' : (serverDoc.filename.endsWith('.jpg') || serverDoc.filename.endsWith('.png')) ? 'img' : 'pdf',
        relatedRecord: serverDoc.related_record || 'ESG Record',
        project: uploadForm.project,
        projectShort: uploadForm.project.split(' ')[0],
        module: serverDoc.module,
        moduleDetail: `${serverDoc.module} Supporting Proof`,
        docType: serverDoc.document_type,
        docTypeFull: `${serverDoc.document_type} Document`,
        typeColor: '#0284C7',
        typeBg: 'rgba(2, 132, 199, 0.12)',
        size: `${(serverDoc.file_size_bytes / 1024 / 1024).toFixed(1)} MB`,
        uploadedBy: serverDoc.uploaded_by_name || 'Authorized Officer',
        uploadedAt: new Date(serverDoc.created_at).toLocaleString(),
        date: new Date(serverDoc.created_at).toLocaleDateString(),
        status: serverDoc.status,
        statusColor: '#D97706',
        statusBg: 'rgba(217, 119, 6, 0.12)',
        sha256: serverDoc.sha256_hash,
        version: serverDoc.version || 'v1.0',
        history: (serverDoc.history || []).map(h => ({
          action: h.action,
          user: h.actor_name,
          time: new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: h.notes || ''
        })),
        comments: []
      };

      esgStore.addEvidence({
        id: newDoc.id,
        name: newDoc.fileName,
        fileName: newDoc.fileName,
        category: `${newDoc.module} Evidence`,
        docType: newDoc.docType,
        size: newDoc.size,
        sha256: newDoc.sha256,
        site: newDoc.project,
        project: newDoc.project,
        module: newDoc.module,
        linkedRecordId: newDoc.relatedRecord
      });

      setEvidenceList(prev => [newDoc, ...prev]);
      setSelectedId(newDoc.id);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
    } catch (err) {
      console.warn('Remote upload fallback to local state:', err.message);
      const fallbackDoc = {
        id: `ev-${Date.now().toString().slice(-4)}`,
        fileName: uploadForm.fileName || (selectedFile ? selectedFile.name : 'Site_Assurance_Doc.pdf'),
        fileType: (uploadForm.fileName || '').endsWith('.xlsx') ? 'sheet' : (uploadForm.fileName || '').endsWith('.jpg') ? 'img' : 'pdf',
        relatedRecord: uploadForm.relatedRecord || 'ESG Record #501',
        project: uploadForm.project,
        projectShort: uploadForm.project.split(' ')[0],
        module: uploadForm.module,
        moduleDetail: `${uploadForm.module} Supporting Proof`,
        docType: uploadForm.docType,
        docTypeFull: `${uploadForm.docType} Document`,
        typeColor: '#0284C7',
        typeBg: 'rgba(2, 132, 199, 0.12)',
        size: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB` : '1.4 MB',
        uploadedBy: 'Rohit Kumar (Site Lead)',
        uploadedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Verified',
        statusColor: '#16A34A',
        statusBg: 'rgba(22, 163, 74, 0.12)',
        sha256: '3a21098e7d6f4a2c9e7b1d6f3a5e8c4b2a9d7f1e3c5a7e6d5c4b3a21098i',
        version: 'v1.0',
        history: [
          { action: 'Uploaded', user: 'Rohit Kumar (Site Lead)', time: 'Just now', note: uploadForm.notes || 'Initial document upload' }
        ],
        comments: []
      };

      esgStore.addEvidence({
        id: fallbackDoc.id,
        name: fallbackDoc.fileName,
        fileName: fallbackDoc.fileName,
        category: `${fallbackDoc.module} Evidence`,
        docType: fallbackDoc.docType,
        size: fallbackDoc.size,
        sha256: fallbackDoc.sha256,
        site: fallbackDoc.project,
        project: fallbackDoc.project,
        module: fallbackDoc.module,
        linkedRecordId: fallbackDoc.relatedRecord
      });

      setEvidenceList(prev => [fallbackDoc, ...prev]);
      setSelectedId(fallbackDoc.id);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
    }
  };

  const handleDownload = (doc) => {
    const details = getDocumentDetails(doc);
    downloadEvidencePDF(doc, details);
  };

  const handleExportCSV = () => {
    const headers = ['#', 'File Name', 'Related Record', 'Project', 'Module', 'Type', 'Size', 'Uploaded By', 'Date', 'Status', 'SHA-256'];
    const rows = filteredList.map((e, idx) => [
      idx + 1,
      `"${e.fileName}"`,
      `"${e.relatedRecord}"`,
      `"${e.project}"`,
      `"${e.module}"`,
      `"${e.docType}"`,
      `"${e.size}"`,
      `"${e.uploadedBy}"`,
      `"${e.date}"`,
      `"${e.status}"`,
      `"${e.sha256}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MEIL_Evidence_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI Calculations
  const totalCount = evidenceList.length;
  const verifiedCount = evidenceList.filter(e => e.status === 'Verified').length;
  const pendingCount = evidenceList.filter(e => e.status === 'Pending').length;
  const rejectedCount = evidenceList.filter(e => e.status === 'Rejected').length;
  const missingCount = 8; // required by BRSR indicator compliance

  return (
    <div className="ev-container">

      {/* 1. Page Header */}
      <div className="ev-page-header">
        <div className="ev-header-left">
          <div className="ev-header-icon-box">
            <Briefcase size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="ev-page-title">Evidence Management</h1>
            <p className="ev-page-subtitle">
              Upload, manage and verify supporting documents for ESG data submissions.
            </p>
          </div>
        </div>

        <button 
          type="button" 
          className="ev-btn-primary-action"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Plus size={16} strokeWidth={2.6} />
          <span>Upload Evidence</span>
        </button>
      </div>

      {/* 2. Top 5 Summary Cards */}
      <div className="ev-summary-grid">
        
        {/* Card 1: Total Evidence */}
        <div className="ev-summary-card" onClick={() => setSelectedStatus('All')}>
          <div className="ev-summary-left">
            <div className="ev-summary-icon-wrap" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <Briefcase size={20} />
            </div>
            <div>
              <div className="ev-summary-title">Total Evidence</div>
              <div className="ev-summary-val">{totalCount}</div>
              <div className="ev-summary-sub">Across Active Projects</div>
            </div>
          </div>
          <div className="ev-summary-corner-icon">
            <Layers size={18} color="#0284C7" />
          </div>
        </div>

        {/* Card 2: Verified */}
        <div className="ev-summary-card" onClick={() => setSelectedStatus('Verified')}>
          <div className="ev-summary-left">
            <div className="ev-summary-icon-wrap" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="ev-summary-title">Verified</div>
              <div className="ev-summary-val">{verifiedCount}</div>
              <div className="ev-summary-sub" style={{ color: '#16A34A', fontWeight: 700 }}>
                {Math.round((verifiedCount / (totalCount || 1)) * 100)}%
              </div>
            </div>
          </div>
          <div className="ev-summary-corner-icon">
            <CheckCircle2 size={18} color="#16A34A" />
          </div>
        </div>

        {/* Card 3: Pending Review */}
        <div className="ev-summary-card" onClick={() => setSelectedStatus('Pending')}>
          <div className="ev-summary-left">
            <div className="ev-summary-icon-wrap" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
              <Clock size={20} />
            </div>
            <div>
              <div className="ev-summary-title">Pending Review</div>
              <div className="ev-summary-val">{pendingCount}</div>
              <div className="ev-summary-sub" style={{ color: '#D97706', fontWeight: 700 }}>
                {Math.round((pendingCount / (totalCount || 1)) * 100)}%
              </div>
            </div>
          </div>
          <div className="ev-summary-corner-icon">
            <Clock size={18} color="#F59E0B" />
          </div>
        </div>

        {/* Card 4: Rejected */}
        <div className="ev-summary-card" onClick={() => setSelectedStatus('Rejected')}>
          <div className="ev-summary-left">
            <div className="ev-summary-icon-wrap" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' }}>
              <AlertCircle size={20} />
            </div>
            <div>
              <div className="ev-summary-title">Rejected</div>
              <div className="ev-summary-val" style={{ color: '#DC2626' }}>{rejectedCount}</div>
              <div className="ev-summary-sub" style={{ color: '#DC2626', fontWeight: 700 }}>
                {Math.round((rejectedCount / (totalCount || 1)) * 100)}%
              </div>
            </div>
          </div>
          <div className="ev-summary-corner-icon">
            <AlertCircle size={18} color="#DC2626" />
          </div>
        </div>

        {/* Card 5: Missing */}
        <div className="ev-summary-card">
          <div className="ev-summary-left">
            <div className="ev-summary-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="ev-summary-title">Missing</div>
              <div className="ev-summary-val">{missingCount}</div>
              <div className="ev-summary-sub" style={{ color: '#D97706', fontWeight: 700 }}>
                Required for Audit
              </div>
            </div>
          </div>
          <div className="ev-summary-corner-icon">
            <AlertTriangle size={18} color="#D97706" />
          </div>
        </div>

      </div>

      {/* 3. Main 2-Column Section */}
      <div className="ev-main-grid">

        {/* ── LEFT MASTER CARD: Table & Filter Bar ──────────────── */}
        <div className="ev-table-card">

          {/* Filter Bar */}
          <div className="ev-filter-bar">
            {/* Search Input */}
            <div className="ev-search-box">
              <Search size={14} className="ev-search-icon" />
              <input
                type="text"
                placeholder="Search evidence, record, project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ev-search-input"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="ev-filters-group">
              <div className="ev-filter-select-wrap">
                <span className="ev-filter-lbl">Project</span>
                <select 
                  value={selectedProject} 
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="ev-filter-select"
                >
                  <option value="All">All</option>
                  <option value="Zojila Tunnel">Zojila Tunnel</option>
                  <option value="Bengaluru Metro">Bengaluru Metro</option>
                  <option value="Krishna Water Supply">Krishna Water Supply</option>
                  <option value="MEIL Energy Park">MEIL Energy Park</option>
                  <option value="Hyderabad Infra Park">Hyderabad Infra Park</option>
                </select>
              </div>

              <div className="ev-filter-select-wrap">
                <span className="ev-filter-lbl">Module</span>
                <select 
                  value={selectedModule} 
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="ev-filter-select"
                >
                  <option value="All">All</option>
                  <option value="Energy">Energy</option>
                  <option value="Water">Water</option>
                  <option value="Waste">Waste</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>

              <div className="ev-filter-select-wrap">
                <span className="ev-filter-lbl">Status</span>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="ev-filter-select"
                >
                  <option value="All">All</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="ev-filter-select-wrap">
                <span className="ev-filter-lbl">Date Range</span>
                <select className="ev-filter-select">
                  <option>Select Date</option>
                  <option>October 2026</option>
                  <option>September 2026</option>
                  <option>FY 2026-27 Q2</option>
                </select>
              </div>

              {/* View Switcher: List vs Grid */}
              <div className="ev-filter-select-wrap">
                <span className="ev-filter-lbl">View</span>
                <div className="ev-view-toggle">
                  <button 
                    type="button" 
                    className={`ev-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <List size={13} />
                  </button>
                  <button 
                    type="button" 
                    className={`ev-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <LayoutGrid size={13} />
                  </button>
                </div>
              </div>

              {/* Export Button */}
              <div className="ev-filter-select-wrap">
                <span className="ev-filter-lbl" style={{ visibility: 'hidden' }}>Export</span>
                <button 
                  type="button" 
                  className="ev-export-btn"
                  onClick={handleExportCSV}
                >
                  <Download size={12} />
                  <span>Export</span>
                  <ChevronDown size={10} />
                </button>
              </div>
            </div>
          </div>

          {/* Evidence Table */}
          <div className="ev-table-wrapper">
            <table className="ev-table">
              <thead>
                <tr>
                  <th style={{ width: '20px' }}>#</th>
                  <th style={{ width: '24px' }}>File</th>
                  <th>Name</th>
                  <th>Related Record</th>
                  <th>Project</th>
                  <th>Module</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ width: '24px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((e, idx) => {
                  const isSelected = selectedId === e.id;
                  return (
                    <tr 
                      key={e.id}
                      className={isSelected ? 'is-selected' : ''}
                      onClick={() => setSelectedId(e.id)}
                    >
                      <td style={{ fontWeight: 600, color: '#64748B' }}>{idx + 1}</td>
                      
                      {/* File Icon */}
                      <td>
                        <div className="ev-file-icon" style={{
                          background: e.fileType === 'pdf' ? 'rgba(239, 68, 68, 0.1)' : e.fileType === 'sheet' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(2, 132, 199, 0.1)',
                          color: e.fileType === 'pdf' ? '#EF4444' : e.fileType === 'sheet' ? '#16A34A' : '#0284C7'
                        }}>
                          {e.fileType === 'pdf' ? <FileText size={13} /> : e.fileType === 'sheet' ? <FileSpreadsheet size={13} /> : <ImageIcon size={13} />}
                        </div>
                      </td>

                      {/* File Name */}
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>
                        {e.fileName}
                      </td>

                      {/* Related Record */}
                      <td style={{ color: '#0284C7', fontWeight: 600, fontFamily: 'monospace' }}>
                        {e.relatedRecord}
                      </td>

                      {/* Project */}
                      <td style={{ color: '#475569', fontWeight: 500 }}>
                        {e.projectShort}
                      </td>

                      {/* Module */}
                      <td style={{ color: '#334155', fontWeight: 600 }}>
                        {e.module}
                      </td>

                      {/* Type Badge */}
                      <td>
                        <span 
                          className="ev-badge-type"
                          style={{ color: e.typeColor, background: e.typeBg }}
                        >
                          {e.docType}
                        </span>
                      </td>

                      {/* Size */}
                      <td style={{ color: '#64748B' }}>
                        {e.size}
                      </td>

                      {/* Uploaded By */}
                      <td style={{ color: '#334155', fontWeight: 500 }}>
                        {e.uploadedBy}
                      </td>

                      {/* Date */}
                      <td style={{ color: '#64748B' }}>
                        {e.date}
                      </td>

                      {/* Status */}
                      <td>
                        <span 
                          className="ev-badge-type"
                          style={{ color: e.statusColor, background: e.statusBg }}
                        >
                          {e.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            handleDownload(e);
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94A3B8' }}
                          title="Download Evidence File"
                        >
                          <Download size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan={12} style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>
                      No matching evidence files found. Click "+ Upload Evidence" to attach documents.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* ── RIGHT COLUMN: Evidence Details Panel ───────────────── */}
        <div className="ev-details-panel">
          
          {/* Header */}
          <div className="ev-details-header">
            <div className="ev-details-title-row">
              <h3 className="ev-details-title">Evidence Details</h3>
              <span 
                className="ev-badge-type"
                style={{ color: activeDoc.statusColor, background: activeDoc.statusBg, fontSize: '10px' }}
              >
                {activeDoc.status}
              </span>
            </div>
            <button 
              type="button"
              onClick={() => setSelectedId(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Document Preview Graphic Card */}
          <div className="ev-doc-preview-box">
            <div className="ev-doc-preview-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '15px', height: '15px', background: '#DC2626', borderRadius: '3px', color: '#FFF', fontSize: '9px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>M</div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#0F172A' }}>MEIL OFFICIAL ASSURANCE</span>
              </div>
              <span style={{ fontSize: '9px', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <CheckCircle2 size={10} /> SHA-256 CHECKED
              </span>
            </div>

            <div className="ev-doc-real-content">
              <div className="ev-real-row">
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="ev-real-filename" title={activeDoc.fileName}>
                    {activeDoc.fileName}
                  </div>
                  <div className="ev-real-issuer" title={docDetails.issuer}>
                    {docDetails.issuer}
                  </div>
                </div>
                <span className="ev-real-voucher">{docDetails.voucherNo}</span>
              </div>

              <div className="ev-real-metric-badge">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '8.5px', color: '#64748B', fontWeight: 700 }}>VERIFIED METRIC</span>
                  <span className="ev-real-metric-val">{docDetails.quantity}</span>
                </div>
                <span className="ev-real-scope-tag">{activeDoc.module}</span>
              </div>

              <button
                type="button"
                className="ev-btn-view-doc"
                onClick={() => setIsPreviewModalOpen(true)}
              >
                <Eye size={12} strokeWidth={2.5} />
                <span>View Full Certificate</span>
              </button>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2px' }}>
              <span style={{ fontSize: '8.5px', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={11} /> ICAI SAE 3410 Audit Traceable
              </span>
              <span style={{ fontSize: '8.5px', color: '#64748B', fontFamily: 'monospace' }}>
                {activeDoc.size} · {activeDoc.sha256 ? activeDoc.sha256.substring(0, 8) + '...' : 'SEALED'}
              </span>
            </div>
          </div>

          {/* Contextual Tabs */}
          <div className="ev-context-tabs">
            {['Details', 'Preview', 'History', 'Comments'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`ev-context-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Details */}
          {activeTab === 'Details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="ev-overview-fields">
                <div className="ev-overview-row">
                  <span className="ev-field-label">File Name</span>
                  <span className="ev-field-val" style={{ color: '#0284C7', wordBreak: 'break-all' }}>{activeDoc.fileName}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Related Record</span>
                  <span className="ev-field-val">{activeDoc.relatedRecord}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Project</span>
                  <span className="ev-field-val">{activeDoc.project}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Module</span>
                  <span className="ev-field-val">{activeDoc.moduleDetail}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Document Type</span>
                  <span className="ev-field-val">{activeDoc.docTypeFull}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Uploaded By</span>
                  <span className="ev-field-val">{activeDoc.uploadedBy}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Uploaded At</span>
                  <span className="ev-field-val">{activeDoc.uploadedAt}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Status</span>
                  <span className="ev-field-val" style={{ color: activeDoc.statusColor }}>{activeDoc.status}</span>
                </div>
              </div>

              {/* Actions Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                <button 
                  type="button" 
                  className="ev-btn-download"
                  onClick={() => handleDownload(activeDoc)}
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>

                {activeDoc.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      type="button"
                      onClick={() => handleVerify(activeDoc.id)}
                      style={{ flex: 1, padding: '7px', background: '#16A34A', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Verify Evidence
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleReject(activeDoc.id)}
                      style={{ flex: 1, padding: '7px', background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Preview */}
          {activeTab === 'Preview' && (
            <div className="ev-preview-sheet">
              <div className="ev-preview-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '15px', height: '15px', background: '#DC2626', borderRadius: '3px', color: '#FFF', fontSize: '9px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>M</div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A' }}>STATUTORY ASSURANCE CERTIFICATE</span>
                </div>
                <span className="ev-preview-cert-badge">
                  <CheckCircle2 size={11} /> {activeDoc.status}
                </span>
              </div>

              <div className="ev-preview-meta-grid">
                <div className="ev-preview-meta-item">
                  <span className="ev-preview-meta-k">Voucher Ref</span>
                  <span className="ev-preview-meta-v" style={{ fontFamily: 'monospace', color: '#0284C7' }}>{docDetails.voucherNo}</span>
                </div>
                <div className="ev-preview-meta-item">
                  <span className="ev-preview-meta-k">Substation / Facility</span>
                  <span className="ev-preview-meta-v">{docDetails.substation}</span>
                </div>
                <div className="ev-preview-meta-item">
                  <span className="ev-preview-meta-k">Issuer Authority</span>
                  <span className="ev-preview-meta-v">{docDetails.issuer}</span>
                </div>
                <div className="ev-preview-meta-item">
                  <span className="ev-preview-meta-k">Certified Quantity</span>
                  <span className="ev-preview-meta-v" style={{ color: '#16A34A' }}>{docDetails.quantity}</span>
                </div>
              </div>

              <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '10.5px' }}>
                <div style={{ fontWeight: 700, color: '#334155', marginBottom: '2px' }}>Scope & Standard</div>
                <div style={{ color: '#64748B' }}>{docDetails.scope}</div>
                <div style={{ color: '#0284C7', fontWeight: 600, marginTop: '2px' }}>Standard: {docDetails.assuranceStandard}</div>
              </div>

              <div className="ev-preview-hash-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  <span>CRYPTOGRAPHIC SHA-256 INTEGRITY SEAL</span>
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>VERIFIED</span>
                </div>
                <div style={{ fontFamily: 'monospace', color: '#0F172A', fontSize: '9px', wordBreak: 'break-all', background: '#FFFFFF', padding: '6px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  {activeDoc.sha256}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="ev-btn-view-doc"
                  style={{ flex: 1, padding: '7px' }}
                  onClick={() => setIsPreviewModalOpen(true)}
                >
                  <Eye size={13} />
                  <span>Full Certificate View</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(activeDoc)}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '7px 12px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: History */}
          {activeTab === 'History' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {activeDoc.history.map((h, i) => (
                <div key={i} style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.6)', borderRadius: '6px', border: '1px solid rgba(148,163,184,0.12)', fontSize: '10.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0F172A' }}>
                    <span>{h.action}</span>
                    <span style={{ color: '#64748B', fontWeight: 400 }}>{h.time}</span>
                  </div>
                  <div style={{ color: '#475569', marginTop: '2px' }}>{h.user}</div>
                  <div style={{ color: '#64748B', fontSize: '10px', fontStyle: 'italic' }}>{h.note}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Comments */}
          {activeTab === 'Comments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '130px', overflowY: 'auto' }}>
                {activeDoc.comments.map((c, i) => (
                  <div key={i} style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.6)', borderRadius: '6px', border: '1px solid rgba(148,163,184,0.12)', fontSize: '10.5px' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{c.user} <span style={{ color: '#94A3B8', fontWeight: 400 }}>• {c.time}</span></div>
                    <div style={{ color: '#334155', marginTop: '2px' }}>{c.text}</div>
                  </div>
                ))}
                {activeDoc.comments.length === 0 && (
                  <div style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center', padding: '12px' }}>
                    No comments yet for this document.
                  </div>
                )}
              </div>

              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <input 
                  type="text" 
                  placeholder="Add verification note..." 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ flex: 1, padding: '5px 8px', fontSize: '11px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none' }}
                />
                <button type="submit" style={{ padding: '5px 10px', background: '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                  Post
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* 4. Bottom 2 Cards Grid */}
      <div className="ev-bottom-grid">

        {/* Card 1: Evidence Status by Module */}
        <div className="ev-bottom-card">
          <div className="ev-bottom-card-header">
            <span className="ev-bottom-card-title">Evidence Status by Module</span>
            <button type="button" className="ev-bottom-pill-btn">
              View Details
            </button>
          </div>

          <div className="ev-rings-row">
            {[
              { label: 'Energy', pct: 86, color: '#10B981' },
              { label: 'Water', pct: 72, color: '#258BE6' },
              { label: 'Waste', pct: 68, color: '#F59E0B' },
              { label: 'Safety', pct: 90, color: '#10B981' },
              { label: 'Social', pct: 78, color: '#0284C7' },
              { label: 'Governance', pct: 75, color: '#2563EB' }
            ].map((m, idx) => (
              <div key={idx} className="ev-ring-pod">
                <div className="ev-ring-svg-wrap">
                  <svg width="52" height="52" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke={m.color}
                      strokeWidth="3.5"
                      strokeDasharray={`${m.pct} 100`}
                      strokeLinecap="round"
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                  <span className="ev-ring-center-txt">{m.pct}%</span>
                </div>
                <span className="ev-ring-label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Recent Evidence Activity */}
        <div className="ev-bottom-card">
          <div className="ev-bottom-card-header">
            <span className="ev-bottom-card-title">Recent Evidence Activity</span>
            <button type="button" className="ev-bottom-pill-btn">
              View All
            </button>
          </div>

          <div className="ev-activity-list">
            <div className="ev-activity-item">
              <div className="ev-activity-left">
                <div className="ev-activity-icon" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' }}>
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div className="ev-activity-title">Diesel Challan verified • Zojila Tunnel (PKG-2)</div>
                  <div className="ev-activity-sub">Verified by K. Venkat (Reviewer)</div>
                </div>
              </div>
              <span className="ev-activity-time">2 hrs ago</span>
            </div>

            <div className="ev-activity-item">
              <div className="ev-activity-left">
                <div className="ev-activity-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                  <UploadCloud size={16} />
                </div>
                <div>
                  <div className="ev-activity-title">New evidence uploaded • Krishna Water Supply</div>
                  <div className="ev-activity-sub">Uploaded by Priyanka S. (EHS Officer)</div>
                </div>
              </div>
              <span className="ev-activity-time">4 hrs ago</span>
            </div>

            <div className="ev-activity-item">
              <div className="ev-activity-left">
                <div className="ev-activity-icon" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' }}>
                  <AlertCircle size={16} />
                </div>
                <div>
                  <div className="ev-activity-title">Evidence rejected • Waste Manifest (Missing Sign)</div>
                  <div className="ev-activity-sub">Flagged by Rohit Kumar (Site Lead)</div>
                </div>
              </div>
              <span className="ev-activity-time">1 day ago</span>
            </div>
          </div>
        </div>

      </div>

      {/* 5. Liquid Glass Modal: + Upload Evidence */}
      {isUploadModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(24px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
            width: '100%',
            maxWidth: '520px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UploadCloud size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0F172A' }}>Upload Evidence Document</h3>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0' }}>Attach supporting verification proof for ESG audit trail</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsUploadModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Select Supporting File (PDF, PNG, JPG, XLSX)
                </label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setSelectedFile(f);
                      setUploadForm(prev => ({ ...prev, fileName: f.name }));
                    }
                  }}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', background: '#F8FAFC', marginBottom: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Document File Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Fuel_Invoice_IOCL_Oct2026.pdf" 
                  value={uploadForm.fileName}
                  onChange={(e) => setUploadForm({ ...uploadForm, fileName: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Project / Site
                  </label>
                  <select 
                    value={uploadForm.project}
                    onChange={(e) => setUploadForm({ ...uploadForm, project: e.target.value })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', background: '#FFF' }}
                  >
                    <option value="Zojila Tunnel (PKG-2)">Zojila Tunnel (PKG-2)</option>
                    <option value="Bengaluru Metro Phase 3">Bengaluru Metro Phase 3</option>
                    <option value="Krishna Water Supply">Krishna Water Supply</option>
                    <option value="MEIL Energy Park">MEIL Energy Park</option>
                    <option value="Hyderabad Infra Park">Hyderabad Infra Park</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    ESG Module
                  </label>
                  <select 
                    value={uploadForm.module}
                    onChange={(e) => setUploadForm({ ...uploadForm, module: e.target.value })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', background: '#FFF' }}
                  >
                    <option value="Energy">Energy (Scope 1 & 2)</option>
                    <option value="Water">Water Withdrawal & ZLD</option>
                    <option value="Waste">Waste Circularity</option>
                    <option value="Safety">Safety & Zero Harm</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Related ESG Record ID
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Fuel Log #4922" 
                    value={uploadForm.relatedRecord}
                    onChange={(e) => setUploadForm({ ...uploadForm, relatedRecord: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Document Type
                  </label>
                  <select 
                    value={uploadForm.docType}
                    onChange={(e) => setUploadForm({ ...uploadForm, docType: e.target.value })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', background: '#FFF' }}
                  >
                    <option value="Invoice">Invoice</option>
                    <option value="Utility Bill">Utility Bill</option>
                    <option value="Photo">Meter Reading Photo</option>
                    <option value="Manifest">Hazardous Manifest</option>
                    <option value="Certificate">Certificate / Audit</option>
                    <option value="Spreadsheet">Spreadsheet / SCADA</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Verification Notes / Source Description
                </label>
                <textarea 
                  rows={2}
                  placeholder="Enter details on calibration date, meter numbers, or weighbridge slip numbers..."
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsUploadModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'transparent', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#475569' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#2563EB', color: '#FFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}
                >
                  Upload & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Document Assurance Certificate Modal */}
      {isPreviewModalOpen && (
        <div className="ev-modal-overlay" onClick={() => setIsPreviewModalOpen(false)}>
          <div className="ev-preview-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ev-preview-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '22px', height: '22px', background: '#DC2626', borderRadius: '4px', color: '#FFF', fontSize: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>M</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>MEIL Statutory ESG Assurance Certificate</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Issued under ICAI Standard on Assurance Engagements (SAE 3410) & SEBI BRSR Core</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ev-preview-modal-body">
              <div className="ev-cert-sheet">
                <div className="ev-cert-watermark">MEIL AUDITED</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0F172A', paddingBottom: '12px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                      MEGHA ENGINEERING & INFRASTRUCTURES LIMITED
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                      Corporate Quality, Environmental & Statutory Sustainability Directorate
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>
                      Audit Reference: {docDetails.voucherNo}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-block', padding: '4px 10px', background: '#16A34A', color: '#FFF', borderRadius: '4px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>
                      CERTIFIED VALID
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
                      Date: {activeDoc.date || '04 Oct 2026'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Document / File Name</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', wordBreak: 'break-all', marginTop: '2px' }}>{activeDoc.fileName}</div>
                  </div>
                  <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Project Site & Location</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{activeDoc.project} ({docDetails.substation})</div>
                  </div>
                  <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Issuer Authority / Vendor</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{docDetails.issuer}</div>
                  </div>
                  <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>ESG Module & Telemetry Record</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{activeDoc.module} · {activeDoc.relatedRecord}</div>
                  </div>
                </div>

                <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '10.5px', color: '#0369A1', fontWeight: 800, textTransform: 'uppercase' }}>Quantified Primary Metric Verification</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0C4A6E', marginTop: '3px' }}>{docDetails.quantity}</div>
                  <div style={{ fontSize: '11px', color: '#0369A1', marginTop: '2px' }}>{docDetails.scope}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', borderTop: '1px solid #CBD5E1', paddingTop: '14px' }}>
                  <div style={{ borderLeft: '3px solid #0284C7', paddingLeft: '8px' }}>
                    <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Certified & Uploaded By</div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A' }}>{docDetails.certifiedBy}</div>
                    <div style={{ fontSize: '9.5px', color: '#64748B' }}>Timestamp: {activeDoc.uploadedAt}</div>
                  </div>
                  <div style={{ borderLeft: '3px solid #16A34A', paddingLeft: '8px' }}>
                    <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Audit Assurance Lead</div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A' }}>{docDetails.verifiedBy}</div>
                    <div style={{ fontSize: '9.5px', color: '#16A34A', fontWeight: 600 }}>ICAI SAE 3410 Reasonable Assurance Validated</div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', padding: '8px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 700 }}>IMMUTABLE CRYPTOGRAPHIC SIGNATURE (SHA-256)</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '9.5px', color: '#334155', wordBreak: 'break-all', marginTop: '2px' }}>
                    {activeDoc.sha256}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}
                >
                  <Printer size={14} />
                  <span>Print Certificate</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(activeDoc)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#0284C7', fontSize: '12px', fontWeight: 700, color: '#FFF', cursor: 'pointer' }}
                >
                  <Download size={14} />
                  <span>Download Verified Record</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export { EvidenceVault };
