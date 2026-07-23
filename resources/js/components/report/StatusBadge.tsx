import type { ReportStatus } from '@/types/reports';

const colors: Record<ReportStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-orange-100 text-orange-800',
    resolved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

const labels: Record<ReportStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
};

export default function StatusBadge({ status }: { status: ReportStatus }) {
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[status]}`}>
            {labels[status]}
        </span>
    );
}
