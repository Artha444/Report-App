import AppLayout from '@/components/AppLayout';
import type React from 'react';

export default function ReportShow({ report }: { report: {
    id: number; title: string; description: string; location: string; priority: string; status: string;
    user: { name: string }; team: { name: string } | null;
    images: { id: number; url: string }[];
    logs: { id: number; action: string; description: string | null; created_at: string; user: { name: string } }[];
    created_at: string; confirmed_at: string | null; resolved_at: string | null;
} }) {
    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-orange-100 text-orange-800',
        resolved: 'bg-green-100 text-green-800',
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">{report.title}</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[report.status]}`}>
                {report.status.replace('_', ' ')}
            </span>

            <div className="mt-6 bg-white rounded shadow p-4 space-y-3">
                <p><strong>Description:</strong> {report.description}</p>
                <p><strong>Location:</strong> {report.location}</p>
                <p><strong>Priority:</strong> {report.priority}</p>
                <p><strong>Reported by:</strong> {report.user.name}</p>
                {report.team && <p><strong>Assigned to:</strong> {report.team.name}</p>}
                <p><strong>Submitted:</strong> {new Date(report.created_at).toLocaleString()}</p>
                {report.confirmed_at && <p><strong>Confirmed:</strong> {new Date(report.confirmed_at).toLocaleString()}</p>}
                {report.resolved_at && <p><strong>Resolved:</strong> {new Date(report.resolved_at).toLocaleString()}</p>}
            </div>

            {report.images.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Images</h2>
                    <div className="flex gap-2 flex-wrap">
                        {report.images.map((img) => (
                            <img key={img.id} src={img.url} className="w-40 h-40 object-cover rounded" alt="" />
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Activity Log</h2>
                <div className="space-y-3">
                    {report.logs.map((log) => (
                        <div key={log.id} className="bg-white rounded shadow p-3 flex justify-between">
                            <div>
                                <span className="font-medium">{log.user.name}</span>
                                {' '}{log.action.replace('_', ' ')}
                                {log.description && <p className="text-sm text-gray-500">{log.description}</p>}
                            </div>
                            <span className="text-sm text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

ReportShow.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
