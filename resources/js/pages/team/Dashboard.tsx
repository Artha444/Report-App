import AppLayout from '@/components/AppLayout';
import StatusBadge from '@/components/report/StatusBadge';
import { Link, usePage } from '@inertiajs/react';
import type React from 'react';

export default function TeamDashboard() {
    const { assignedCount, resolvedCount, recentReports } = usePage().props as {
        assignedCount: number;
        resolvedCount: number;
        recentReports: { id: number; title: string; status: string; team: { name: string } | null; user: { name: string } }[];
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Team Dashboard</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded shadow p-4">
                    <div className="text-2xl font-bold">{assignedCount}</div>
                    <div className="text-sm text-gray-500">In Progress</div>
                </div>
                <div className="bg-white rounded shadow p-4">
                    <div className="text-2xl font-bold">{resolvedCount}</div>
                    <div className="text-sm text-gray-500">Resolved</div>
                </div>
            </div>

            <h2 className="text-lg font-semibold mb-2">Latest Reports</h2>
            <div className="space-y-2">
                {recentReports.map((r) => (
                    <Link key={r.id} href={`/reports/${r.id}`} className="block bg-white p-3 rounded shadow hover:shadow-md">
                        <div className="font-medium">{r.title}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                            <StatusBadge status={r.status as never} />
                            <span>by {r.user.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

TeamDashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
