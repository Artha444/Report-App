import AppLayout from '@/components/AppLayout';
import { Link, useForm, usePage } from '@inertiajs/react';
import type React from 'react';

export default function AdminReports() {
    const { reports, teams } = usePage().props as {
        reports: { data: { id: number; title: string; status: string; priority: string; user: { name: string }; team: { id: number; name: string } | null }[]; links: { url: string | null; label: string; active: boolean }[] };
        teams: { id: number; name: string }[];
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
            <h1 className="text-2xl font-bold mb-4">All Reports</h1>
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-3">Title</th>
                            <th className="text-left p-3">Reporter</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Team</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.data.map((report) => (
                            <tr key={report.id} className="border-t">
                                <td className="p-3">{report.title}</td>
                                <td className="p-3">{report.user.name}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[report.status]}`}>
                                        {report.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-3">{report.team?.name ?? '—'}</td>
                                <td className="p-3 flex gap-2">
                                    <Link href={`/reports/${report.id}`} className="text-blue-600 text-sm">View</Link>
                                    {report.status === 'pending' && (
                                        <form onSubmit={(e) => { e.preventDefault(); post(`/admin/reports/${report.id}/confirm`); }}>
                                            <button type="submit" className="text-green-600 text-sm">Confirm</button>
                                        </form>
                                    )}
                                    {report.status === 'confirmed' && (
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            const form = e.target as HTMLFormElement;
                                            const fd = new FormData(form);
                                            post(`/admin/reports/${report.id}/assign`, { data: { team_id: fd.get('team_id') as string } });
                                        }}>
                                            <select name="team_id" className="text-sm border rounded p-1" required>
                                                <option value="">Assign to...</option>
                                                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                            </select>
                                            <button type="submit" className="text-blue-600 text-sm ml-1">Go</button>
                                        </form>
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

AdminReports.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
