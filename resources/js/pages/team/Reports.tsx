import AppLayout from '@/components/AppLayout';
import StatusBadge from '@/components/report/StatusBadge';
import ResolveForm from '@/components/report/ResolveForm';
import { Link, useForm, usePage } from '@inertiajs/react';
import type React from 'react';

export default function TeamReports() {
    const { reports } = usePage().props as {
        reports: { data: { id: number; title: string; status: string; priority: string; team: { name: string } | null; user: { name: string } }[] };
    };
    const { post } = useForm();

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
                                    <StatusBadge status={report.status as never} />
                                </td>
                                <td className="p-3 flex gap-2">
                                    <Link href={`/reports/${report.id}`} className="text-blue-600 text-sm">View</Link>
                                    {report.status === 'confirmed' && (
                                        <button onClick={() => post(`/team/reports/${report.id}/in-progress`)} className="text-orange-600 text-sm">
                                            Start
                                        </button>
                                    )}
                                    {report.status === 'in_progress' && (
                                        <ResolveForm reportId={report.id} />
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
