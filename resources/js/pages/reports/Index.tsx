import AppLayout from '@/components/AppLayout';
import { Link } from '@inertiajs/react';
import type React from 'react';

export default function ReportIndex({ reports }: { reports: { data: { id: number; title: string; status: string; priority: string; created_at: string }[]; links: { url: string | null; label: string; active: boolean }[] } }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">My Reports</h1>
                <Link href="/reports/create" className="bg-blue-600 text-white px-4 py-2 rounded">New Report</Link>
            </div>
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-3">Title</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Priority</th>
                            <th className="text-left p-3">Date</th>
                            <th className="p-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {reports.data.map((report) => (
                            <tr key={report.id} className="border-t">
                                <td className="p-3">{report.title}</td>
                                <td className="p-3"><StatusBadge status={report.status} /></td>
                                <td className="p-3">{report.priority}</td>
                                <td className="p-3">{new Date(report.created_at).toLocaleDateString()}</td>
                                <td className="p-3">
                                    <Link href={`/reports/${report.id}`} className="text-blue-600">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* ponytail: simple pagination; paginator component if more pages */}
            {reports.links.length > 3 && (
                <div className="flex gap-2 mt-4 justify-center">
                    {reports.links.map((l, i) =>
                        l.url ? (
                            <Link key={i} href={l.url} className={`px-3 py-1 rounded ${l.active ? 'bg-blue-600 text-white' : 'bg-white'}`}
                                dangerouslySetInnerHTML={{ __html: l.label }} />
                        ) : (
                            <span key={i} className="px-3 py-1 text-gray-400" dangerouslySetInnerHTML={{ __html: l.label }} />
                        )
                    )}
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-orange-100 text-orange-800',
        resolved: 'bg-green-100 text-green-800',
    };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>{status.replace('_', ' ')}</span>;
}

ReportIndex.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
