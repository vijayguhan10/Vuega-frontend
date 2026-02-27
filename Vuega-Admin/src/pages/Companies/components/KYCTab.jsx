import React, { useState } from 'react'
import { FaShieldAlt } from 'react-icons/fa'
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
//  Data source:
//    GET  /api/companies/:id/details → kycDocuments array
//    PATCH /api/companies/:id/kyc    → verify / reject document
//    Audit log: KYC_VERIFIED | KYC_REJECTED
// ═══════════════════════════════════════════════════════════════

// Mock KYC documents per company
// Mock KYC data for demonstration
const companyKYCMap = {
  'C-101': [
    { id: 'KYC-1001', name: 'Certificate of Incorporation', type: 'PDF', size: '2.4 MB', status: 'Verified', uploadedDate: 'Jan 10, 2025', verifiedBy: 'Admin-01', verifiedDate: 'Jan 12, 2025' },
    { id: 'KYC-1002', name: 'GST Registration Certificate', type: 'PDF', size: '1.1 MB', status: 'Verified', uploadedDate: 'Jan 10, 2025', verifiedBy: 'Admin-01', verifiedDate: 'Jan 12, 2025' },
    { id: 'KYC-1003', name: 'PAN Card (Company)', type: 'Image', size: '850 KB', status: 'Verified', uploadedDate: 'Jan 10, 2025', verifiedBy: 'Admin-01', verifiedDate: 'Jan 12, 2025' },
    { id: 'KYC-1004', name: 'Fleet Insurance Policy', type: 'PDF', size: '5.2 MB', status: 'Verified', uploadedDate: 'Jan 11, 2025', verifiedBy: 'Admin-02', verifiedDate: 'Jan 13, 2025' },
    { id: 'KYC-1005', name: 'Pollution Certificate', type: 'PDF', size: '1.8 MB', status: 'Pending', uploadedDate: 'Feb 15, 2026' },
  ],
  'C-102': [
    { id: 'KYC-2001', name: 'Certificate of Incorporation', type: 'PDF', size: '2.1 MB', status: 'Verified', uploadedDate: 'Feb 05, 2025', verifiedBy: 'Admin-01', verifiedDate: 'Feb 07, 2025' },
    { id: 'KYC-2002', name: 'GST Registration Certificate', type: 'PDF', size: '1.3 MB', status: 'Verified', uploadedDate: 'Feb 05, 2025', verifiedBy: 'Admin-01', verifiedDate: 'Feb 07, 2025' },
    { id: 'KYC-2003', name: 'PAN Card (Company)', type: 'Image', size: '720 KB', status: 'Pending', uploadedDate: 'Feb 18, 2026' },
  ],
  'C-103': [
    { id: 'KYC-3001', name: 'Certificate of Incorporation', type: 'PDF', size: '2.6 MB', status: 'Verified', uploadedDate: 'Nov 28, 2024', verifiedBy: 'Admin-02', verifiedDate: 'Nov 30, 2024' },
    { id: 'KYC-3002', name: 'GST Registration Certificate', type: 'PDF', size: '1.0 MB', status: 'Rejected', uploadedDate: 'Nov 28, 2024', rejectionReason: 'Document expired. Upload renewed certificate.' },
    { id: 'KYC-3003', name: 'Fleet Insurance Policy', type: 'PDF', size: '4.8 MB', status: 'Rejected', uploadedDate: 'Dec 01, 2024', rejectionReason: 'Coverage period does not match current fleet.' },
  ],
  'C-104': [
    { id: 'KYC-4001', name: 'Certificate of Incorporation', type: 'PDF', size: '2.3 MB', status: 'Pending', uploadedDate: 'Feb 18, 2026' },
    { id: 'KYC-4002', name: 'GST Registration Certificate', type: 'PDF', size: '1.2 MB', status: 'Pending', uploadedDate: 'Feb 18, 2026' },
    { id: 'KYC-4003', name: 'PAN Card (Company)', type: 'Image', size: '900 KB', status: 'Pending', uploadedDate: 'Feb 18, 2026' },
  ],
  'C-105': [
    { id: 'KYC-5001', name: 'Certificate of Incorporation', type: 'PDF', size: '2.0 MB', status: 'Verified', uploadedDate: 'Jun 15, 2024', verifiedBy: 'Admin-01', verifiedDate: 'Jun 17, 2024' },
    { id: 'KYC-5002', name: 'GST Registration Certificate', type: 'PDF', size: '1.4 MB', status: 'Verified', uploadedDate: 'Jun 15, 2024', verifiedBy: 'Admin-01', verifiedDate: 'Jun 17, 2024' },
  ],
  'C-106': [
    { id: 'KYC-6001', name: 'Certificate of Incorporation', type: 'PDF', size: '2.5 MB', status: 'Pending', uploadedDate: 'Feb 15, 2026' },
    { id: 'KYC-6002', name: 'GST Registration Certificate', type: 'PDF', size: '1.1 MB', status: 'Pending', uploadedDate: 'Feb 15, 2026' },
  ],
  'C-107': [
    { id: 'KYC-7001', name: 'Certificate of Incorporation', type: 'PDF', size: '3.1 MB', status: 'Verified', uploadedDate: 'Mar 01, 2024', verifiedBy: 'Admin-01', verifiedDate: 'Mar 03, 2024' },
    { id: 'KYC-7002', name: 'GST Registration Certificate', type: 'PDF', size: '1.6 MB', status: 'Verified', uploadedDate: 'Mar 01, 2024', verifiedBy: 'Admin-01', verifiedDate: 'Mar 03, 2024' },
    { id: 'KYC-7003', name: 'PAN Card (Company)', type: 'Image', size: '810 KB', status: 'Verified', uploadedDate: 'Mar 01, 2024', verifiedBy: 'Admin-02', verifiedDate: 'Mar 04, 2024' },
    { id: 'KYC-7004', name: 'Fleet Insurance Policy', type: 'PDF', size: '6.0 MB', status: 'Verified', uploadedDate: 'Mar 02, 2024', verifiedBy: 'Admin-02', verifiedDate: 'Mar 05, 2024' },
  ],
  'C-109': [
    { id: 'KYC-9001', name: 'Certificate of Incorporation', type: 'PDF', size: '1.9 MB', status: 'Pending', uploadedDate: 'Feb 10, 2026' },
  ],
  'C-110': [
    { id: 'KYC-0001', name: 'Certificate of Incorporation', type: 'PDF', size: '2.2 MB', status: 'Verified', uploadedDate: 'Sep 01, 2024', verifiedBy: 'Admin-01', verifiedDate: 'Sep 03, 2024' },
    { id: 'KYC-0002', name: 'GST Registration Certificate', type: 'PDF', size: '1.5 MB', status: 'Verified', uploadedDate: 'Sep 01, 2024', verifiedBy: 'Admin-01', verifiedDate: 'Sep 03, 2024' },
    { id: 'KYC-0003', name: 'Fleet Insurance Policy', type: 'PDF', size: '4.5 MB', status: 'Pending', uploadedDate: 'Feb 12, 2026' },
  ],
}

/**
 * KYC status config
 */
const statusConfig = {
  Verified: { icon: CheckCircle, color: 'text-[#2E86AB]', bg: 'bg-accent/20', label: 'Verified' },
  Pending: { icon: Clock, color: 'text-[#D4A800]', bg: 'bg-secondary', label: 'Pending Review' },
  Rejected: { icon: XCircle, color: 'text-alert', bg: 'bg-alert/10', label: 'Rejected' },
}

/**
 * KYC completion percentage
 */
const KYCProgress = ({ documents }) => {
  const total = documents.length
  const verified = documents.filter((d) => d.status === 'Verified').length
  const pct = total > 0 ? Math.round((verified / total) * 100) : 0
  const barColor = pct === 100 ? 'bg-[#2E86AB]' : pct >= 50 ? 'bg-[#D4A800]' : 'bg-alert'

  return (
    <div className="bg-[#F5F5F4] rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-text-muted" />
          <span className="text-xs font-bold text-text">KYC Completion</span>
        </div>
        <span className={`font-bold ${pct === 100 ? 'text-[#2E86AB]' : 'text-text'}`}>
          {pct}%
        </span>
      </div>
      <div className="w-full h-2 bg-primary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-text-muted">
        {verified} of {total} documents verified
      </span>
    </div>
  )
}

const KYCTab = ({ company }) => {
  const documents = companyKYCMap[company?.id] || []
  const [actioningDoc, setActioningDoc] = useState(null) // doc ID being actioned
  const [localDocs, setLocalDocs] = useState(documents)

  // Reset local docs when company changes
  React.useEffect(() => {
    setLocalDocs(companyKYCMap[company?.id] || [])
    setActioningDoc(null)
  }, [company?.id])

  if (localDocs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#F5F5F4] flex items-center justify-center">
          <FileText className="w-6 h-6 text-text-muted/40" />
        </div>
        <span className="text-text-muted">No KYC documents uploaded.</span>
        <span className="text-[10px] text-text-muted">
          Documents will appear once the company submits KYC paperwork.
        </span>
      </div>
    )
  }

  // Simulated verify / reject actions
  // TODO: Replace with PATCH /api/companies/:id/kyc
  const handleVerify = (docId) => {
    setLocalDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, status: 'Verified', verifiedBy: 'Current Admin', verifiedDate: 'Feb 21, 2026' }
          : d
      )
    )
    setActioningDoc(null)
  }

  const handleReject = (docId) => {
    setLocalDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, status: 'Rejected', rejectionReason: 'Document requires re-submission with correct details.' }
          : d
      )
    )
    setActioningDoc(null)
  }

  const pending = localDocs.filter((d) => d.status === 'Pending').length
  const verified = localDocs.filter((d) => d.status === 'Verified').length
  const rejected = localDocs.filter((d) => d.status === 'Rejected').length

  return (
    <div className="flex flex-col gap-4 py-1">
      {/* KYC Progress */}
      <KYCProgress documents={localDocs} />

      {/* Summary strip */}
      <div className="flex items-center gap-4 px-1">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs font-semibold text-text">{localDocs.length} Documents</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3 h-3 text-[#2E86AB]" />
          <span className="text-[10px] text-text-muted">{verified} Verified</span>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#D4A800]" />
            <span className="text-[10px] text-text-muted">{pending} Pending</span>
          </div>
        )}
        {rejected > 0 && (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-alert" />
            <span className="text-[10px] text-text-muted">{rejected} Rejected</span>
          </div>
        )}
      </div>

      {/* Document Cards */}
      <div className="flex flex-col gap-2">
        {localDocs.map((doc) => {
          const cfg = statusConfig[doc.status] || statusConfig.Pending
          const StatusIcon = cfg.icon
          const isActioning = actioningDoc === doc.id

          return (
            <div
              key={doc.id}
              className="bg-primary rounded-lg border border-border p-3 flex flex-col gap-2"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs font-semibold text-text truncate">
                      {doc.name}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.uploadedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${cfg.bg} ${cfg.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {cfg.label}
                </span>
              </div>

              {/* Verification info */}
              {doc.status === 'Verified' && doc.verifiedBy && (
                <div className="flex items-center gap-2 text-[10px] text-text-muted pl-11">
                  <ShieldCheck className="w-3 h-3 text-[#2E86AB]" />
                  <span>
                    Verified by <span className="font-medium text-text">{doc.verifiedBy}</span> on {doc.verifiedDate}
                  </span>
                </div>
              )}

              {/* Rejection reason */}
              {doc.status === 'Rejected' && doc.rejectionReason && (
                <div className="flex items-start gap-2 text-[10px] pl-11">
                  <AlertTriangle className="w-3 h-3 text-alert shrink-0 mt-0.5" />
                  <span className="text-alert italic">"{doc.rejectionReason}"</span>
                </div>
              )}

              {/* Action buttons for Pending documents */}
              {doc.status === 'Pending' && (
                <div className="flex items-center gap-2 pl-11 mt-1">
                  {!isActioning ? (
                    <>
                      <button
                        onClick={() => setActioningDoc(doc.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-[#F5F5F4] text-text-muted rounded-md hover:bg-secondary transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        Review
                      </button>
                      <button className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-[#F5F5F4] text-text-muted rounded-md hover:bg-secondary transition-colors">
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleVerify(doc.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-accent/20 text-[#2E86AB] rounded-md hover:bg-accent/30 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Verify
                      </button>
                      <button
                        onClick={() => handleReject(doc.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-alert/10 text-alert rounded-md hover:bg-alert/20 transition-colors"
                      >
                        <XCircle className="w-3 h-3" />
                        Reject
                      </button>
                      <button
                        onClick={() => setActioningDoc(null)}
                        className="px-2.5 py-1 text-[10px] font-semibold text-text-muted hover:text-text transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Governance footer */}
      <div className="flex items-center gap-1.5 px-1 text-[10px] text-text-muted">
        <FaShieldAlt className="w-2.5 h-2.5" />
        <span>KYC verification actions are immutably audit-logged per compliance policy</span>
      </div>
    </div>
  )
}

export default KYCTab
