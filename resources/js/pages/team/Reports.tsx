import AppLayout from '@/components/AppLayout';
import { Link, useForm, usePage } from '@inertiajs/react';
import type React from 'react';

export default function TeamReports() {
    const { reports } = usePage().props as {
        reports: { data: { id: number; title: string; status: string; priority: string; team: { name: string } | null; user: { name: string } }[] };
    };
    const { post } = useForm();

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-orange-100 text-orange-800',
        resolved: 'bg-green-100 text-green-800',
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Team Reports</h1>
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-3">Title</th>
                            <th className="text-left p-3">Reporter</th>
                            <th className="text-left p-3">Priority</th>
                            <th className="text-left p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.data.map((report) => (
                            <tr key={report.id} className="border-t">
                                <td className="p-3">{report.title}</td>
                                <td className="p-3">{report.user.name}</td>
                                <td className="p-3">{report.priority}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[report.status]}`}>
                                        {report.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-3 flex gap-2">
                                    <Link href={`/reports/${report.id}`} className="text-blue-600 text-sm">View</Link>
                                    {report.status === 'confirmed' && (
                                        <button onClick={() => post(`/team/reports/${report.id}/in-progress`)} className="text-orange-600 text-sm">
                                            Start
                                        </button>
                                    )}
                                    {report.status === 'in_progress' && (
                                        <button onClick={() => post(`/team/reports/${report.id}/resolve`)} className="text-green-600 text-sm">
                                            Resolve
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

TeamReports.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
