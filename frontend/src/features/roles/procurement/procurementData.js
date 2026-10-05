/**
 * MEIL ESG & BRSR Platform - Procurement & Scope 3 Master Data Store
 * Grounded in MEIL Group supply chain operations & SEBI BRSR Principle 8 / Value Chain Core
 */

export const INITIAL_SUPPLIERS = [
  {
    id: 'SUP-001',
    code: 'SUP-001',
    name: 'ABC Construction Ltd.',
    category: 'Civil',
    location: 'Hyderabad',
    msme: 'Yes',
    local: 'Yes',
    esgStatus: 'Assessed',
    risk: 'Low',
    status: 'Active',
    spend: '₹42.8 Cr',
    contact: 'Rajesh Kumar',
    email: 'rajesh@abcconstruction.in',
    phone: '+91 98765 43210',
    bu: 'Infra - Roads',
    type: 'Contractor',
    onboarded: '12 Jan 2024',
    assessmentScore: 78,
    assessmentDate: '18 Aug 2026',
    nextReview: '18 Aug 2027',
    tier: 'Tier 1'
  },
  {
    id: 'SUP-002',
    code: 'SUP-002',
    name: 'TechBuild Engineers',
    category: 'Electrical',
    location: 'Bengaluru',
    msme: 'No',
    local: 'Yes',
    esgStatus: 'Pending',
    risk: 'Medium',
    status: 'Active',
    spend: '₹31.4 Cr',
    contact: 'Amit Sharma',
    email: 'amit@techbuild.com',
    phone: '+91 98450 11223',
    bu: 'Power & Transmission',
    type: 'Equipment Vendor',
    onboarded: '05 Mar 2024',
    assessmentScore: 65,
    assessmentDate: '12 Aug 2026',
    nextReview: '12 Aug 2027',
    tier: 'Tier 1'
  },
  {
    id: 'SUP-003',
    code: 'SUP-003',
    name: 'Green Materials Pvt Ltd',
    category: 'Materials',
    location: 'Mumbai',
    msme: 'Yes',
    local: 'No',
    esgStatus: 'Assessed',
    risk: 'Low',
    status: 'Active',
    spend: '₹19.6 Cr',
    contact: 'Priya Mehta',
    email: 'priya@greenmaterials.in',
    phone: '+91 98220 54321',
    bu: 'Hydro & Irrigation',
    type: 'Raw Material Supplier',
    onboarded: '20 Jul 2024',
    assessmentScore: 82,
    assessmentDate: '18 Aug 2026',
    nextReview: '18 Aug 2027',
    tier: 'Tier 2'
  },
  {
    id: 'SUP-004',
    code: 'SUP-004',
    name: 'SafeWorks Services',
    category: 'Services',
    location: 'Delhi',
    msme: 'No',
    local: 'Yes',
    esgStatus: 'Not Assessed',
    risk: 'High',
    status: 'Active',
    spend: '₹14.2 Cr',
    contact: 'Neha Singh',
    email: 'neha@safeworks.org',
    phone: '+91 98110 99887',
    bu: 'Refinery & Hydrocarbons',
    type: 'Service Provider',
    onboarded: '14 Feb 2025',
    assessmentScore: null,
    assessmentDate: null,
    nextReview: '25 Sep 2026',
    tier: 'Tier 1'
  },
  {
    id: 'SUP-005',
    code: 'SUP-005',
    name: 'PowerGrid Solutions',
    category: 'Electrical',
    location: 'Chennai',
    msme: 'No',
    local: 'Yes',
    esgStatus: 'Assessed',
    risk: 'Low',
    status: 'Active',
    spend: '₹28.9 Cr',
    contact: 'K. Sunder',
    email: 'sunder@powergrid.co.in',
    phone: '+91 98440 66554',
    bu: 'Power & Transmission',
    type: 'Equipment Vendor',
    onboarded: '10 Jun 2024',
    assessmentScore: 78,
    assessmentDate: '11 Aug 2026',
    nextReview: '01 Aug 2027',
    tier: 'Tier 1'
  },
  {
    id: 'SUP-006',
    code: 'SUP-006',
    name: 'EcoTransport Logistics',
    category: 'Logistics',
    location: 'Pune',
    msme: 'Yes',
    local: 'Yes',
    esgStatus: 'In Progress',
    risk: 'Low',
    status: 'Active',
    spend: '₹11.5 Cr',
    contact: 'Vikas Rao',
    email: 'vikas@ecotransport.in',
    phone: '+91 98500 33442',
    bu: 'Clean Mobility',
    type: 'Logistics Partner',
    onboarded: '18 Nov 2024',
    assessmentScore: null,
    assessmentDate: null,
    nextReview: '15 Oct 2026',
    tier: 'Tier 2'
  },
  {
    id: 'SUP-007',
    code: 'SUP-007',
    name: 'InfraStone Suppliers',
    category: 'Materials',
    location: 'Jaipur',
    msme: 'No',
    local: 'Yes',
    esgStatus: 'Assessed',
    risk: 'Medium',
    status: 'Inactive',
    spend: '₹8.4 Cr',
    contact: 'Rahul Mishra',
    email: 'rahul@infrastone.com',
    phone: '+91 98290 88776',
    bu: 'Infra - Roads',
    type: 'Quarry & Aggregates',
    onboarded: '02 Apr 2024',
    assessmentScore: 71,
    assessmentDate: '04 May 2026',
    nextReview: '04 May 2027',
    tier: 'Tier 2'
  },
  {
    id: 'SUP-008',
    code: 'SUP-008',
    name: 'BuildRight Equipment',
    category: 'Equipment',
    location: 'Ahmedabad',
    msme: 'No',
    local: 'Yes',
    esgStatus: 'Pending',
    risk: 'High',
    status: 'Active',
    spend: '₹22.1 Cr',
    contact: 'Gautam Patel',
    email: 'gautam@buildright.in',
    phone: '+91 98250 44331',
    bu: 'City Gas Distribution',
    type: 'Machinery Lessor',
    onboarded: '09 Jan 2025',
    assessmentScore: 58,
    assessmentDate: '15 Jul 2026',
    nextReview: '15 Oct 2026',
    tier: 'Tier 3'
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'PR-2026-001',
    date: '01 Sep 2026',
    supplier: 'ABC Construction Ltd.',
    category: 'Civil',
    project: 'Road Project (Zojila)',
    amount: '₹12.5 Cr',
    local: 'Yes',
    msme: 'Yes',
    source: 'ERP',
    status: 'Completed'
  },
  {
    id: 'PR-2026-002',
    date: '03 Sep 2026',
    supplier: 'TechBuild Engineers',
    category: 'Electrical',
    project: 'Metro Phase 1',
    amount: '₹8.2 Cr',
    local: 'Yes',
    msme: 'No',
    source: 'Manual',
    status: 'Verified'
  },
  {
    id: 'PR-2026-003',
    date: '05 Sep 2026',
    supplier: 'Green Materials Pvt Ltd',
    category: 'Materials',
    project: 'Plant Expansion',
    amount: '₹3.8 Cr',
    local: 'No',
    msme: 'Yes',
    source: 'Import',
    status: 'Completed'
  },
  {
    id: 'PR-2026-004',
    date: '08 Sep 2026',
    supplier: 'SafeWorks Services',
    category: 'Services',
    project: 'Refinery Upgradation',
    amount: '₹4.2 Cr',
    local: 'Yes',
    msme: 'No',
    source: 'ERP',
    status: 'In Review'
  },
  {
    id: 'PR-2026-005',
    date: '10 Sep 2026',
    supplier: 'PowerGrid Solutions',
    category: 'Electrical',
    project: 'Transmission Corridor',
    amount: '₹9.6 Cr',
    local: 'Yes',
    msme: 'Yes',
    source: 'ERP',
    status: 'Completed'
  }
];

export const INITIAL_ASSESSMENTS = [
  {
    id: 'SA-2026-001',
    supplier: 'ABC Construction Ltd.',
    type: 'General ESG',
    date: '18 Aug 2026',
    score: 78,
    risk: 'Medium',
    status: 'Approved',
    nextReview: '18 Aug 2027'
  },
  {
    id: 'SA-2026-002',
    supplier: 'TechBuild Engineers',
    type: 'Environmental',
    date: '12 Aug 2026',
    score: 65,
    risk: 'High',
    status: 'In Review',
    nextReview: '12 Aug 2027'
  },
  {
    id: 'SA-2026-003',
    supplier: 'Green Materials Pvt Ltd',
    type: 'Environmental',
    date: '18 Aug 2026',
    score: 82,
    risk: 'Low',
    status: 'Approved',
    nextReview: '18 Aug 2027'
  },
  {
    id: 'SA-2026-004',
    supplier: 'SafeWorks Services',
    type: 'H&S',
    date: '05 Aug 2026',
    score: null,
    risk: 'High',
    status: 'In Progress',
    nextReview: '05 Aug 2027'
  },
  {
    id: 'SA-2026-005',
    supplier: 'PowerGrid Solutions',
    type: 'Social',
    date: '11 Aug 2026',
    score: 78,
    risk: 'Medium',
    status: 'Submitted',
    nextReview: '01 Aug 2027'
  }
];

export const INITIAL_RISKS = [
  {
    id: 'RSK-001',
    supplier: 'SafeWorks Services',
    riskType: 'H&S Non-compliance',
    severity: 'Critical',
    assessment: 'SA-2026-004',
    owner: 'Neha Singh',
    dueDate: '25 Sep 2026',
    status: 'Open'
  },
  {
    id: 'RSK-002',
    supplier: 'TechBuild Engineers',
    riskType: 'Environmental waiver',
    severity: 'High',
    assessment: 'SA-2026-002',
    owner: 'Amit Kumar',
    dueDate: '28 Sep 2026',
    status: 'In Progress'
  },
  {
    id: 'RSK-003',
    supplier: 'InfraStone Suppliers',
    riskType: 'Labor Practices',
    severity: 'Medium',
    assessment: '-',
    owner: 'Rahul Mishra',
    dueDate: '05 Oct 2026',
    status: 'Open'
  },
  {
    id: 'RSK-004',
    supplier: 'EcoTransport Logistics',
    riskType: 'Data Quality',
    severity: 'High',
    assessment: '-',
    owner: 'Priya Nair',
    dueDate: '28 Sep 2026',
    status: 'Under Review'
  },
  {
    id: 'RSK-005',
    supplier: 'BuildRight Equipment',
    riskType: 'Certification Expiry',
    severity: 'Medium',
    assessment: '-',
    owner: 'Suresh R.',
    dueDate: '10 Oct 2026',
    status: 'Open'
  }
];

export const INITIAL_ACTIONS = [
  {
    id: 'CA-001',
    supplier: 'SafeWorks Services',
    source: 'Risk',
    issue: 'H&S Non-compliance',
    priority: 'High',
    owner: 'Neha Singh',
    dueDate: '25 Sep 2026',
    status: 'Overdue'
  },
  {
    id: 'CA-002',
    supplier: 'TechBuild Engineers',
    source: 'Assessment',
    issue: 'Emission Control',
    priority: 'Medium',
    owner: 'Amit Kumar',
    dueDate: '28 Sep 2026',
    status: 'In Progress'
  },
  {
    id: 'CA-003',
    supplier: 'Green Materials Pvt Ltd',
    source: 'Assessment',
    issue: 'Waste Management',
    priority: 'Medium',
    owner: 'Priya Nair',
    dueDate: '02 Oct 2026',
    status: 'Open'
  },
  {
    id: 'CA-004',
    supplier: 'InfraStone Suppliers',
    source: 'Audit',
    issue: 'Documentation',
    priority: 'Low',
    owner: 'Rahul Mishra',
    dueDate: '05 Oct 2026',
    status: 'Open'
  },
  {
    id: 'CA-005',
    supplier: 'EcoTransport Logistics',
    source: 'Risk',
    issue: 'Labor Practices',
    priority: 'High',
    owner: 'Suresh R.',
    dueDate: '10 Oct 2026',
    status: 'Under Review'
  }
];

export const INITIAL_EVIDENCE = [
  {
    id: 'EV-001',
    title: 'ISO 14001 Certificate',
    linkedTo: 'ABC Construction Ltd.',
    type: 'Certification',
    uploadDate: '12 Sep 2026',
    status: 'Verified',
    size: '2.4 MB'
  },
  {
    id: 'EV-002',
    title: 'H&S Policy Document',
    linkedTo: 'SafeWorks Services',
    type: 'Policy',
    uploadDate: '10 Sep 2026',
    status: 'Pending Review',
    size: '1.8 MB'
  },
  {
    id: 'EV-003',
    title: 'Purchase Order #PR-001',
    linkedTo: 'PR-2026-001',
    type: 'Invoice',
    uploadDate: '08 Sep 2026',
    status: 'Verified',
    size: '850 KB'
  },
  {
    id: 'EV-004',
    title: 'ESG Questionnaire Form',
    linkedTo: 'TechBuild Engineers',
    type: 'Assessment',
    uploadDate: '05 Sep 2026',
    status: 'Verified',
    size: '3.1 MB'
  },
  {
    id: 'EV-005',
    title: 'MSME Udhyam Certificate',
    linkedTo: 'Green Materials Pvt Ltd',
    type: 'Certificate',
    uploadDate: '01 Sep 2026',
    status: 'Rejected',
    size: '1.2 MB'
  }
];

export const INITIAL_SUBMISSIONS = [
  {
    id: 'SUB-001',
    type: 'Supplier Master',
    scope: 'All Units (BU)',
    submittedBy: 'Anand Mahindra V.',
    date: '12 Sep 2026',
    status: 'Under Review',
    reviewer: 'Rohan Verma'
  },
  {
    id: 'SUB-002',
    type: 'Transactions',
    scope: 'Infra - Roads',
    submittedBy: 'Priya Nair',
    date: '10 Sep 2026',
    status: 'Approved',
    reviewer: 'Rohan Verma'
  },
  {
    id: 'SUB-003',
    type: 'ESG Assessment',
    scope: 'All Units',
    submittedBy: 'Amit Kumar',
    date: '08 Sep 2026',
    status: 'Correction Needed',
    reviewer: 'Ankit Patel'
  },
  {
    id: 'SUB-004',
    type: 'Value Chain',
    scope: 'Plant Expansion',
    submittedBy: 'Suresh R.',
    date: '05 Sep 2026',
    status: 'Approved',
    reviewer: 'Rohan Verma'
  },
  {
    id: 'SUB-005',
    type: 'Scope 3 Emissions',
    scope: 'All Units',
    submittedBy: 'Anand Mahindra V.',
    date: '01 Sep 2026',
    status: 'Submitted',
    reviewer: '-'
  }
];

export const INITIAL_ACTION_CENTER_ITEMS = [
  {
    num: 1,
    action: 'Complete ESG assessment',
    type: 'Assessment',
    entity: 'TechBuild Engineers',
    priority: 'High',
    dueDate: '25 Sep 2026',
    status: 'Overdue',
    actionBtn: 'Start'
  },
  {
    num: 2,
    action: 'Upload MSME certificate',
    type: 'Evidence',
    entity: 'Green Materials Pvt Ltd',
    priority: 'Medium',
    dueDate: '26 Sep 2026',
    status: 'Open',
    actionBtn: 'Upload'
  },
  {
    num: 3,
    action: 'Review risk mitigation plan',
    type: 'Risk',
    entity: 'SafeWorks Services',
    priority: 'High',
    dueDate: '27 Sep 2026',
    status: 'In Progress',
    actionBtn: 'Review'
  },
  {
    num: 4,
    action: 'Submit procurement data to Group HQ',
    type: 'Submission',
    entity: 'All Units',
    priority: 'Medium',
    dueDate: '28 Sep 2026',
    status: 'Open',
    actionBtn: 'Submit'
  },
  {
    num: 5,
    action: 'Update supplier classification',
    type: 'Data Quality',
    entity: 'EcoTransport Logistics',
    priority: 'Low',
    dueDate: '30 Sep 2026',
    status: 'Pending',
    actionBtn: 'Update'
  }
];
