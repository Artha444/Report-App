import type { Report } from '@/types/reports';
import StatusBadge from './StatusBadge';

export default function DetailCard({ report }: { report: Report }) {
    return (
        <div className="mt-6 bg-white rounded shadow p-4 space-y-3">
            <p><strong>Description:</strong> {report.description}</p>
            <p><strong>Location:</strong> {report.location}</p>
            <p><strong>Priority:</strong> {report.priority}</p>
            <p><strong>Reported by:</strong> {report.user.name}</p>
            {report.team && <p><strong>Assigned to:</strong> {report.team.name}</p>}
            <p><strong>Status:</strong> <StatusBadge status={report.status} /></p>
            <p><strong>Submitted:</strong> {new Date(report.created_at).toLocaleString()}</p>
            {report.confirmed_at && <p><strong>Confirmed:</strong> {new Date(report.confirmed_at).toLocaleString()}</p>}
            {report.resolved_at && <p><strong>Resolved:</strong> {new Date(report.resolved_at).toLocaleString()}</p>}

            {report.rejection_reason && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mt-3">
                    <p className="text-sm font-medium text-red-800">Rejection Reason</p>
                    <p className="text-sm text-red-700">{report.rejection_reason}</p>
                </div>
            )}

            {report.resolution_notes && (
                <div className="bg-green-50 border border-green-200 rounded p-3 mt-3">
                    <p className="text-sm font-medium text-green-800">Resolution Notes</p>
                    <p className="text-sm text-green-700">{report.resolution_notes}</p>
                </div>
            )}

            {report.user_feedback && (
                <div className="bg-purple-50 border border-purple-200 rounded p-3 mt-3">
                    <p className="text-sm font-medium text-purple-800">User Feedback (Reopen)</p>
                    <p className="text-sm text-purple-700">{report.user_feedback}</p>
                </div>
            )}

            {report.resolution_evidence && (
                <div className="mt-3">
                    <p className="text-sm font-medium mb-1">Resolution Evidence</p>
                    <img src={`/storage/${report.resolution_evidence}`} alt="Evidence" className="w-64 h-64 object-cover rounded" />
                </div>
            )}
        </div>
    );
}
