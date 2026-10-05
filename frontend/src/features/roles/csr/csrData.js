// ====================================================================
// MEIL ESG & BRSR REPORTING PLATFORM — CSR & COMMUNITY DATA LAYER
// Authoritative Ground-Truth Dataset for CSR & Community Lead Panel
// ====================================================================

export const INITIAL_CSR_PROJECTS = [
  {
    id: 'CSR-001',
    project_code: 'CSR-001',
    name: 'Rural Education Program',
    category: 'Education',
    location: 'Odisha',
    state: 'Odisha',
    district: 'Khurda & Koraput',
    business_unit: 'Hydel & Tunnel Infrastructure',
    start_date: '01 Apr 2025',
    end_date: '31 Mar 2027',
    budget_cr: 2.0,
    spend_cr: 1.2,
    beneficiaries: 5420,
    communities_count: 18,
    status: 'Active',
    impact_status: 'On Track',
    partner: 'Pratham Education Foundation',
    funding_source: 'MEIL Corporate CSR Foundation (Sec 135)',
    responsible_owner: 'Priya Nair',
    description: 'Improve access to quality education for rural children through school infrastructure support, digital learning classrooms and merit scholarships.',
    milestones: [
      { name: 'Project Initiation', date: '01 Apr 2025', status: 'Completed' },
      { name: 'Community Survey', date: '15 Jun 2025', status: 'Completed' },
      { name: 'Infrastructure Work', date: '01 Oct 2025', status: 'In Progress' },
      { name: 'Program Implementation', date: '01 Jan 2026', status: 'Pending' },
      { name: 'Impact Assessment', date: '15 Feb 2027', status: 'Pending' }
    ]
  },
  {
    id: 'CSR-002',
    project_code: 'CSR-002',
    name: 'Primary Health Camps',
    category: 'Health',
    location: 'Telangana',
    state: 'Telangana',
    district: 'Khammam & Bhadradri',
    business_unit: 'Kaleshwaram Lift Irrigation',
    start_date: '15 Apr 2026',
    end_date: '31 Mar 2027',
    budget_cr: 1.2,
    spend_cr: 0.8,
    beneficiaries: 4100,
    communities_count: 14,
    status: 'Active',
    impact_status: 'In Progress',
    partner: 'Apollo Community Health Outreach',
    funding_source: 'MEIL Group CSR Trust',
    responsible_owner: 'Dr. Ramesh Babu',
    description: 'Deploying mobile health vans, preventive health screenings, maternal health checkups and teleconsultations across 14 remote gram panchayats.'
  },
  {
    id: 'CSR-003',
    project_code: 'CSR-003',
    name: 'Skill Development & Livelihood',
    category: 'Livelihood',
    location: 'Karnataka',
    state: 'Karnataka',
    district: 'Bellary & Koppal',
    business_unit: 'Heavy Engineering & Manufacturing',
    start_date: '01 May 2026',
    end_date: '30 Apr 2027',
    budget_cr: 1.0,
    spend_cr: 0.6,
    beneficiaries: 3600,
    communities_count: 8,
    status: 'Planned',
    impact_status: 'In Progress',
    partner: 'National Skill Development Corp (NSDC)',
    funding_source: 'MEIL CSR Statutory Fund',
    responsible_owner: 'Anjali Das',
    description: 'Vocational skill development centers for rural youth in solar panel installation, CNC machining, welding, and sustainable agricultural tools.'
  },
  {
    id: 'CSR-004',
    project_code: 'CSR-004',
    name: 'Drinking Water Facility (RO Plants)',
    category: 'Community Infra',
    location: 'Bihar',
    state: 'Bihar',
    district: 'Patna & Vaishali',
    business_unit: 'WTP / City Gas Distribution',
    start_date: '12 Jan 2026',
    end_date: '31 Dec 2026',
    budget_cr: 1.5,
    spend_cr: 1.5,
    beneficiaries: 2400,
    communities_count: 12,
    status: 'Completed',
    impact_status: 'Achieved',
    partner: 'Gram Vikas Trust',
    funding_source: 'MEIL Infrastructure CSR',
    responsible_owner: 'Rahul Sinha',
    description: 'Installation of 12 community Reverse Osmosis drinking water purification units delivering safe, potable fluoride-free water to 2,400 households.'
  },
  {
    id: 'CSR-005',
    project_code: 'CSR-005',
    name: 'Green Village Initiative & Afforestation',
    category: 'Environment',
    location: 'Assam',
    state: 'Assam',
    district: 'Kamrup & Dibrugarh',
    business_unit: 'Hydrocarbon & Petrochemicals',
    start_date: '20 Feb 2026',
    end_date: '31 Mar 2027',
    budget_cr: 1.1,
    spend_cr: 0.9,
    beneficiaries: 1800,
    communities_count: 6,
    status: 'Active',
    impact_status: 'On Track',
    partner: 'Assam Forest Department & TERI',
    funding_source: 'MEIL Green Horizon Fund',
    responsible_owner: 'Amit Kumar',
    description: 'Extensive native tree plantation (10,000+ saplings), biogas distribution, and solar mini-grids for carbon sequestration and community clean energy.'
  },
  {
    id: 'CSR-006',
    project_code: 'CSR-006',
    name: 'Women Empowerment & Self Help Groups',
    category: 'Livelihood',
    location: 'Maharashtra',
    state: 'Maharashtra',
    district: 'Pune & Solapur',
    business_unit: 'Solar Power Projects BU',
    start_date: '10 Mar 2026',
    end_date: '31 Mar 2027',
    budget_cr: 1.4,
    spend_cr: 1.1,
    beneficiaries: 2100,
    communities_count: 10,
    status: 'Active',
    impact_status: 'On Track',
    partner: 'Mahila Vikas Foundation',
    funding_source: 'MEIL Corporate CSR',
    responsible_owner: 'Priya Nair',
    description: 'Financial literacy training, micro-enterprise funding and market linkages for 65 women self-help groups engaged in organic produce and handicraft.'
  },
  {
    id: 'CSR-007',
    project_code: 'CSR-007',
    name: 'Community Sanitation & Hygiene Drive',
    category: 'Health',
    location: 'UP',
    state: 'Uttar Pradesh',
    district: 'Lucknow & Unnao',
    business_unit: 'MEIL Water Infra',
    start_date: '05 Apr 2026',
    end_date: '31 Mar 2027',
    budget_cr: 0.8,
    spend_cr: 0.4,
    beneficiaries: 1500,
    communities_count: 7,
    status: 'On-Hold',
    impact_status: 'In Progress',
    partner: 'Sulabh International',
    funding_source: 'MEIL CSR Fund',
    responsible_owner: 'Amit Kumar',
    description: 'Construction of 50 community eco-toilets and solid-liquid waste treatment facilities in semi-urban resettlement colonies.'
  },
  {
    id: 'CSR-008',
    project_code: 'CSR-008',
    name: 'Digital Learning Centers',
    category: 'Education',
    location: 'Rajasthan',
    state: 'Rajasthan',
    district: 'Jaipur & Barmer',
    business_unit: 'Renewable Power Infra',
    start_date: '01 Jun 2026',
    end_date: '31 May 2027',
    budget_cr: 0.9,
    spend_cr: 0.7,
    beneficiaries: 1320,
    communities_count: 5,
    status: 'Active',
    impact_status: 'On Track',
    partner: 'Agastya International Foundation',
    funding_source: 'MEIL Foundation',
    responsible_owner: 'Priya Nair',
    description: 'Setting up smart classrooms, solar tablets, and interactive STEM labs for primary and secondary government school students.'
  }
];

export const INITIAL_COMMUNITIES = [
  { id: 'COM-001', name: 'Raghunathpur', district: 'Khurda', state: 'Odisha', population: 3200, projects_count: 2, status: 'Active', lead: 'Priya Nair', primary_program: 'Rural Education Program' },
  { id: 'COM-002', name: 'Kantapada', district: 'Cuttack', state: 'Odisha', population: 4850, projects_count: 1, status: 'Active', lead: 'Priya Nair', primary_program: 'Rural Education & Health' },
  { id: 'COM-003', name: 'Barbil', district: 'Sundargarh', state: 'Odisha', population: 2600, projects_count: 1, status: 'Active', lead: 'Priya Nair', primary_program: 'Skill Development' },
  { id: 'COM-004', name: 'Dumuripuda', district: 'Koraput', state: 'Odisha', population: 1950, projects_count: 1, status: 'Active', lead: 'Rahul Sinha', primary_program: 'Drinking Water RO' },
  { id: 'COM-005', name: 'Malkangiri Block', district: 'Malkangiri', state: 'Odisha', population: 3400, projects_count: 2, status: 'Planned', lead: 'Rahul Sinha', primary_program: 'Mobile Health Clinics' },
  { id: 'COM-006', name: 'Baripada', district: 'Mayurbhanj', state: 'Odisha', population: 2150, projects_count: 1, status: 'Active', lead: 'Priya Nair', primary_program: 'Community Sanitation' },
  { id: 'COM-007', name: 'Jeypore', district: 'Koraput', state: 'Odisha', population: 4120, projects_count: 2, status: 'Active', lead: 'Dr. Ramesh Babu', primary_program: 'Primary Health Camps' },
  { id: 'COM-008', name: 'Nabarangpur', district: 'Nabarangpur', state: 'Odisha', population: 3950, projects_count: 1, status: 'Active', lead: 'Dr. Ramesh Babu', primary_program: 'Green Village & Solar' }
];

export const INITIAL_BENEFICIARIES_DATA = {
  total: 18420,
  female: { pct: 52, count: 9578 },
  male: { pct: 46, count: 8467 },
  other: { pct: 2, count: 375 },
  by_category: [
    { category: 'Education', count: 5200, pct: 28 },
    { category: 'Health', count: 4100, pct: 22 },
    { category: 'Livelihood', count: 3600, pct: 16 },
    { category: 'Community Infra', count: 2400, pct: 14 },
    { category: 'Environment', count: 1800, pct: 10 },
    { category: 'Others', count: 1320, pct: 8 }
  ],
  distribution: [
    { group: 'Children', pct: 34, count: 6262 },
    { group: 'Women', pct: 28, count: 5157 },
    { group: 'Youth', pct: 16, count: 2947 },
    { group: 'Farmers', pct: 12, count: 2210 },
    { group: 'Elderly', pct: 6, count: 1105 },
    { group: 'PwD', pct: 4, count: 739 }
  ]
};

export const INITIAL_IMPACT_INDICATORS = [
  { id: 'IMP-001', indicator: 'Students Enrolled in Digital Classrooms', project: 'CSR-001', baseline: 0, target: 2000, current: 1650, unit: 'People', status: 'On Track', methodology: 'Biometric School Attendance & Exam Enrollment', evidence_ref: 'EVD-EDU-2026-01' },
  { id: 'IMP-002', indicator: 'Health Camps Conducted', project: 'CSR-002', baseline: 0, target: 50, current: 38, unit: 'Camps', status: 'In Progress', methodology: 'Gram Panchayat Medical Camp Register & Doctor Log', evidence_ref: 'EVD-MED-2026-04' },
  { id: 'IMP-003', indicator: 'Households with Clean Drinking Water', project: 'CSR-004', baseline: 0, target: 1000, current: 1000, unit: 'Households', status: 'Achieved', methodology: 'Smart Water Card Dispensing Meters & Lab Test', evidence_ref: 'EVD-WTR-2026-09' },
  { id: 'IMP-004', indicator: 'Livelihoods Supported via Skill Certifications', project: 'CSR-003', baseline: 0, target: 500, current: 320, unit: 'People', status: 'In Progress', methodology: 'NSDC Certificate Issuance & Placement Track', evidence_ref: 'EVD-LIV-2026-02' },
  { id: 'IMP-005', indicator: 'Sanitation Facilities Built & Operational', project: 'CSR-007', baseline: 0, target: 50, current: 30, unit: 'Units', status: 'In Progress', methodology: 'Geo-tagged Construction Completion Audits', evidence_ref: 'EVD-SAN-2026-06' },
  { id: 'IMP-006', indicator: 'Tree Plantation & Native Sapling Survival', project: 'CSR-005', baseline: 0, target: 10000, current: 7800, unit: 'Trees', status: 'On Track', methodology: 'Drone LiDAR Forest Canopy & Forest Dept Audit', evidence_ref: 'EVD-ENV-2026-11' }
];

export const INITIAL_STAKEHOLDERS = [
  { id: 'STK-001', date: '18 Sep 2026', stakeholder_type: 'Community', group: 'Gram Panchayat Leaders & Sarpanch', project: 'CSR-001', community: 'Raghunathpur, Odisha', purpose: 'Mid-term school building inspection & scholarship quota', participants: 45, feedback: 'Requested 2 additional solar light poles near school approach road', status: 'Feedback Recorded', action: 'Approved budget reallocation for 2 solar streetlights' },
  { id: 'STK-002', date: '12 Sep 2026', stakeholder_type: 'Local Authorities', group: 'District Health Officer (DHO)', project: 'CSR-002', community: 'Khammam, Telangana', purpose: 'Coordination on vaccine drives and anemia screening in children', participants: 18, feedback: 'Requested MEIL mobile van to cover additional 4 tribal hamlets', status: 'Action Created', action: 'Route plan updated to add 4 tribal thandas from Oct 01' },
  { id: 'STK-003', date: '04 Sep 2026', stakeholder_type: 'NGO Partner', group: 'Mahila Vikas Foundation Team', project: 'CSR-006', community: 'Pune & Solapur, MH', purpose: 'Quarterly review of self-help group revolving fund repayment', participants: 32, feedback: 'Repayment rate at 99.4%; requested packaging machinery workshop', status: 'Follow-up', action: 'Workshop scheduled with Central Food Tech Research Institute' },
  { id: 'STK-004', date: '28 Aug 2026', stakeholder_type: 'Beneficiary Groups', group: 'Small & Marginal Farmer Collectives', project: 'CSR-005', community: 'Kamrup, Assam', purpose: 'Bio-fertilizer distribution and drip irrigation demonstration', participants: 68, feedback: 'Enthusiastic adoption; requested organic certification guidance', status: 'Closed', action: 'Certified Organic certification agency appointed' }
];

export const INITIAL_GRIEVANCES = [
  { id: 'GRV-001', date: '14 Sep 2026', project: 'CSR-004', community: 'Dumuripuda, Koraput', category: 'Community Services', description: 'Water pressure fluctuation in morning hours at RO Plant #2 tap station.', severity: 'Medium', owner: 'Rahul Sinha', due_date: '21 Sep 2026', status: 'In Progress', resolution: 'Pump booster valve replacement ordered; tech team on site.' },
  { id: 'GRV-002', date: '10 Sep 2026', project: 'CSR-001', community: 'Kantapada, Cuttack', category: 'Construction Impact', description: 'Gravel dust from school boundary wall repair affecting adjacent farm path.', severity: 'High', owner: 'Priya Nair', due_date: '18 Sep 2026', status: 'Overdue', resolution: 'Water sprinkling deployed; tarpaulin barriers erected. Site inspection pending.' },
  { id: 'GRV-003', date: '05 Sep 2026', project: 'CSR-007', community: 'Lucknow, UP', category: 'Environmental Concern', description: 'Delay in municipal sewage connection for 4 completed community blocks.', severity: 'Critical', owner: 'Amit Kumar', due_date: '15 Sep 2026', status: 'Under Review', resolution: 'Escalated to Nagar Nigam Chief Engineer for joint inspection clearance.' },
  { id: 'GRV-004', date: '22 Aug 2026', project: 'CSR-002', community: 'Bhadradri, Telangana', category: 'Access / Connectivity', description: 'Mobile health camp halted due to culvert damage after monsoon rain.', severity: 'Low', owner: 'Dr. Ramesh Babu', due_date: '30 Aug 2026', status: 'Resolved', resolution: 'Temporary steel road plate installed with project team assistance.' }
];

export const INITIAL_EVIDENCE_ITEMS = [
  { id: 'EVD-001', title: 'Q2 School Infrastructure Completion Certificate & Geo-Photos', project: 'CSR-001', category: 'Project Report & Photos', type: 'PDF + Images', upload_date: '18 Sep 2026', size: '14.2 MB', verified_by: 'Third Party Auditor (TUV India)', status: 'Verified' },
  { id: 'EVD-002', title: 'Primary Health Camp 38 Batch Patient Registration Logbook', project: 'CSR-002', category: 'Beneficiary Log', type: 'XLSX + Signed PDF', upload_date: '14 Sep 2026', size: '4.8 MB', verified_by: 'Medical Officer Khammam', status: 'Verified' },
  { id: 'EVD-003', title: 'Water Quality Fluoride & TDS Laboratory Test Reports (NABL)', project: 'CSR-004', category: 'Lab Testing Report', type: 'PDF', upload_date: '10 Sep 2026', size: '2.1 MB', verified_by: 'NABL Certified Lab', status: 'Verified' },
  { id: 'EVD-004', title: 'NSDC Skill Center Batch 4 Attendance & Assessment Sheet', project: 'CSR-003', category: 'Attendance Records', type: 'XLSX', upload_date: '08 Sep 2026', size: '1.6 MB', verified_by: 'Pending Lead Verification', status: 'Pending Review' },
  { id: 'EVD-005', title: 'Self-Help Group Seed Capital Disbursement Receipts', project: 'CSR-006', category: 'Financial Invoices', type: 'PDF', upload_date: '05 Sep 2026', size: '8.4 MB', verified_by: 'Bank Manager Solapur', status: 'Verified' },
  { id: 'EVD-006', title: 'Forestry Sapling Plantation Drone LiDAR Survey', project: 'CSR-005', category: 'Geo-spatial Audit', type: 'GeoJSON + PDF', upload_date: '01 Sep 2026', size: '32.1 MB', verified_by: 'Assam State Biodiversity Board', status: 'Verified' },
  { id: 'EVD-007', title: 'Eco-toilet Foundation Concrete Pour Test Slump Slip', project: 'CSR-007', category: 'Inspection Slip', type: 'JPG', upload_date: '28 Aug 2026', size: '3.4 MB', verified_by: 'Flagged for illegible signature', status: 'Rejected' },
  { id: 'EVD-008', title: 'Digital STEM Lab Tablet Procurement Tax Invoices', project: 'CSR-008', category: 'Invoices', type: 'PDF', upload_date: '25 Aug 2026', size: '5.2 MB', verified_by: 'MEIL Accounts Dept', status: 'Verified' }
];

export const INITIAL_SUBMISSIONS = [
  { id: 'SUB-001', module: 'CSR Projects', scope: 'All Projects', period: 'Sep 2026', submitted_by: 'Priya Nair', date: '20 Sep 2026', status: 'Submitted', reviewer: 'CSR Steering Committee', approver: 'Director CSR & Sustainability' },
  { id: 'SUB-002', module: 'Impact Data', scope: 'CSR-001', period: 'Sep 2026', submitted_by: 'Priya Nair', date: '18 Sep 2026', status: 'Under Review', reviewer: 'ICAI Social Auditor', approver: 'Head ESG & BRSR' },
  { id: 'SUB-003', module: 'Beneficiaries', scope: 'CSR-003', period: 'Aug 2026', submitted_by: 'Priya Nair', date: '15 Sep 2026', status: 'Approved', reviewer: 'District Welfare Board', approver: 'Executive Director MEIL' },
  { id: 'SUB-004', module: 'Community', scope: 'All Projects', period: 'Aug 2026', submitted_by: 'Priya Nair', date: '10 Sep 2026', status: 'Correction Required', reviewer: 'SEBI BRSR Assurance Lead', approver: 'Head ESG & BRSR', remarks: 'Provide demographic gender split for Malkangiri block.' },
  { id: 'SUB-005', module: 'Stakeholders', scope: 'CSR-002', period: 'Aug 2026', submitted_by: 'Priya Nair', date: '05 Sep 2026', status: 'Approved', reviewer: 'Internal Audit Committee', approver: 'CSR Committee Chair' }
];

export const INITIAL_ACTION_CENTER_ITEMS = [
  { id: 'ACT-001', task: 'Impact data submission for Q2', module: 'Pending Impact', project: 'CSR-001', owner: 'Priya Nair', due_date: '22 Sep 2026', priority: 'High', status: 'Open', action_label: 'Upload / Submit' },
  { id: 'ACT-002', evidence_desc: 'Evidence missing for medical camp 39', module: 'Evidence', project: 'CSR-002', owner: 'Priya Nair', due_date: '20 Sep 2026', priority: 'High', status: 'Open', action_label: 'Upload' },
  { id: 'ACT-003', task: 'Grievance follow-up on RO plant water pressure', module: 'Grievance', project: 'CSR-004', owner: 'Rahul Sinha', due_date: '21 Sep 2026', priority: 'Medium', status: 'In Progress', action_label: 'View' },
  { id: 'ACT-004', task: 'Stakeholder consultation meeting with Gram Panchayat', module: 'Stakeholders', project: 'CSR-003', owner: 'Anjali Das', due_date: '25 Sep 2026', priority: 'Medium', status: 'Open', action_label: 'Open' },
  { id: 'ACT-005', task: 'Beneficiary data demographic split incomplete', module: 'Beneficiaries', project: 'CSR-006', owner: 'Priya Nair', due_date: '23 Sep 2026', priority: 'High', status: 'Open', action_label: 'Update' },
  { id: 'ACT-006', task: 'Project milestone overdue: Sanitation block handover', module: 'Project', project: 'CSR-007', owner: 'Amit Kumar', due_date: '18 Sep 2026', priority: 'Critical', status: 'Overdue', action_label: 'Review' },
  { id: 'ACT-007', task: 'Resubmit corrected Community Coverage Annexure', module: 'Submissions', project: 'All Projects', owner: 'Priya Nair', due_date: '24 Sep 2026', priority: 'High', status: 'Open', action_label: 'Fix & Resubmit' }
];

export const SPEND_TREND_DATA = [
  { month: 'Apr', total: 1.8, local: 1.1, msme: 0.5 },
  { month: 'May', total: 2.1, local: 1.3, msme: 0.6 },
  { month: 'Jun', total: 2.4, local: 1.5, msme: 0.7 },
  { month: 'Jul', total: 1.9, local: 1.2, msme: 0.5 },
  { month: 'Aug', total: 2.2, local: 1.4, msme: 0.7 },
  { month: 'Sep', total: 2.2, local: 1.5, msme: 0.8 }
];

export const BENEFICIARIES_TREND_DATA = [
  { month: 'Apr', total: 12400, children: 4200, women: 3500 },
  { month: 'May', total: 13800, children: 4700, women: 3900 },
  { month: 'Jun', total: 15200, children: 5100, women: 4300 },
  { month: 'Jul', total: 16100, children: 5400, women: 4600 },
  { month: 'Aug', total: 17300, children: 5800, women: 4900 },
  { month: 'Sep', total: 18420, children: 6262, women: 5157 }
];
