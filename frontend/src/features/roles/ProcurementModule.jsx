import React, { useState } from 'react';
import {
  INITIAL_SUPPLIERS,
  INITIAL_TRANSACTIONS,
  INITIAL_ASSESSMENTS,
  INITIAL_RISKS,
  INITIAL_ACTIONS,
  INITIAL_EVIDENCE,
  INITIAL_SUBMISSIONS,
  INITIAL_ACTION_CENTER_ITEMS
} from './procurement/procurementData';

import ProcurementOverviewScreen from './procurement/screens/ProcurementOverviewScreen';
import SupplierDirectoryScreen from './procurement/screens/SupplierDirectoryScreen';
import SupplierDetailScreen from './procurement/screens/SupplierDetailScreen';
import ProcurementTransactionsScreen from './procurement/screens/ProcurementTransactionsScreen';
import SupplierAssessmentsScreen from './procurement/screens/SupplierAssessmentsScreen';
import ValueChainScopeScreen from './procurement/screens/ValueChainScopeScreen';
import SupplierRiskScreen from './procurement/screens/SupplierRiskScreen';
import ProcurementActionsScreen from './procurement/screens/ProcurementActionsScreen';
import ProcurementEvidenceScreen from './procurement/screens/ProcurementEvidenceScreen';
import ProcurementSubmissionsScreen from './procurement/screens/ProcurementSubmissionsScreen';
import ProcurementAnalyticsScreen from './procurement/screens/ProcurementAnalyticsScreen';
import ProcurementActionCenterScreen from './procurement/screens/ProcurementActionCenterScreen';

import AddSupplierModal from './procurement/modals/AddSupplierModal';
import LogProcurementModal from './procurement/modals/LogProcurementModal';
import StartAssessmentModal from './procurement/modals/StartAssessmentModal';
import './ProcurementModule.css';

export default function ProcurementModule({
  activeTab = 'overview',
  onNavigateTab,
  reportingPeriod = 'September 2026',
  user = { name: 'Anand Mahindra V.', role_title: 'Procurement & Scope 3 Officer' }
}) {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [assessments, setAssessments] = useState(INITIAL_ASSESSMENTS);
  const [risks, setRisks] = useState(INITIAL_RISKS);
  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [evidence, setEvidence] = useState(INITIAL_EVIDENCE);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [actionItems, setActionItems] = useState(INITIAL_ACTION_CENTER_ITEMS);

  // Selected supplier for detail view
  const [selectedSupplier, setSelectedSupplier] = useState(INITIAL_SUPPLIERS[0]);

  // Modal open states
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isLogProcurementOpen, setIsLogProcurementOpen] = useState(false);
  const [isStartAssessmentOpen, setIsStartAssessmentOpen] = useState(false);

  // Handlers for real data mutations
  const handleAddSupplier = (newSupplier) => {
    setSuppliers((prev) => [newSupplier, ...prev]);
  };

  const handleLogProcurement = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleStartAssessment = (newAss) => {
    setAssessments((prev) => [newAss, ...prev]);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'suppliers':
        return (
          <SupplierDirectoryScreen
            suppliers={suppliers}
            onNavigateTab={onNavigateTab}
            onSelectSupplier={(s) => setSelectedSupplier(s)}
            onOpenAddSupplier={() => setIsAddSupplierOpen(true)}
          />
        );

      case 'supplier-detail':
        return (
          <SupplierDetailScreen
            supplier={selectedSupplier}
            onNavigateTab={onNavigateTab}
            onBack={() => onNavigateTab?.('suppliers')}
          />
        );

      case 'procurement':
      case 'transactions':
        return (
          <ProcurementTransactionsScreen
            transactions={transactions}
            onNavigateTab={onNavigateTab}
            onOpenLogProcurement={() => setIsLogProcurementOpen(true)}
          />
        );

      case 'assessments':
        return (
          <SupplierAssessmentsScreen
            assessments={assessments}
            onNavigateTab={onNavigateTab}
            onOpenStartAssessment={() => setIsStartAssessmentOpen(true)}
          />
        );

      case 'value-chain':
        return (
          <ValueChainScopeScreen
            onNavigateTab={onNavigateTab}
          />
        );

      case 'risk':
        return (
          <SupplierRiskScreen
            risks={risks}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'actions':
      case 'corrective-actions':
        return (
          <ProcurementActionsScreen
            actions={actions}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'evidence':
        return (
          <ProcurementEvidenceScreen
            evidence={evidence}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'submissions':
        return (
          <ProcurementSubmissionsScreen
            submissions={submissions}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'analytics':
        return (
          <ProcurementAnalyticsScreen
            onNavigateTab={onNavigateTab}
          />
        );

      case 'action-center':
      case 'compliance':
        return (
          <ProcurementActionCenterScreen
            actionItems={actionItems}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'overview':
      default:
        return (
          <ProcurementOverviewScreen
            suppliers={suppliers}
            transactions={transactions}
            onNavigateTab={onNavigateTab}
            onOpenAddSupplier={() => setIsAddSupplierOpen(true)}
            onOpenStartAssessment={() => setIsStartAssessmentOpen(true)}
          />
        );
    }
  };

  return (
    <div className="proc-module-root" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Active Screen Rendering */}
      {renderScreen()}

      {/* Global Modals */}
      <AddSupplierModal
        isOpen={isAddSupplierOpen}
        onClose={() => setIsAddSupplierOpen(false)}
        onAddSupplier={handleAddSupplier}
      />

      <LogProcurementModal
        isOpen={isLogProcurementOpen}
        onClose={() => setIsLogProcurementOpen(false)}
        onLogProcurement={handleLogProcurement}
        suppliers={suppliers}
      />

      <StartAssessmentModal
        isOpen={isStartAssessmentOpen}
        onClose={() => setIsStartAssessmentOpen(false)}
        onStartAssessment={handleStartAssessment}
        suppliers={suppliers}
      />
    </div>
  );
}
