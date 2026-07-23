import AppLayout from '@/components/AppLayout';
import StatusBadge from '@/components/report/StatusBadge';
import { Link, usePage } from '@inertiajs/react';
import type React from 'react';

export default function Dashboard() {
    const { props } = usePage();

    // ponytail: role-conditional rendering; if roles multiply, extract per-role widgets
    if ('pendingCount' in props) {
        return <AdminDashboard />;
    }
    if ('assignedCount' in props) {
        return <TeacherDashboard />;
    }
    return <StudentDashboard />;
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
        </div>
    );
}

function StudentDashboard() {
    const { myReportsCount, recentReports } = usePage().props as {
        myReportsCount: number;
        recentReports: { id: number; title: string; status: string; created_at: string }[];
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Dashboard</h1>
            <StatCard label="My Reports" value={myReportsCount} />
            <div className="mt-6">
                <Link href="/reports/create" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">
                    Submit a Report
                </Link>
            </div>
        </div>
    );
}

function TeacherDashboard() {
    const { assignedCount, resolvedCount, recentReports, teams } = usePage().props as {
        assignedCount: number;
        resolvedCount: number;
        recentReports: { id: number; title: string; status: string; team: { name: string } | null }[];
        teams: { id: number; name: string }[];
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Team Dashboard</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <StatCard label="Assigned (In Progress)" value={assignedCount} />
                <StatCard label="Resolved" value={resolvedCount} />
            </div>
            <div className="mb-4">
                <p className="text-sm text-gray-500">My Teams: {teams.map((t) => t.name).join(', ')}</p>
            </div>
            <h2 className="text-lg font-semibold mb-2">Latest Reports</h2>
            <ReportList reports={recentReports} />
        </div>
    );
}

function AdminDashboard() {
    const { pendingCount, confirmedCount, rejectedCount, resolvedCount, totalReports, recentReports, teams } = usePage().props as {
        pendingCount: number;
        confirmedCount: number;
        rejectedCount: number;
        resolvedCount: number;
        totalReports: number;
        recentReports: { id: number; title: string; status: string; user: { name: string } }[];
        teams: { id: number; name: string; members: { id: number; name: string }[] }[];
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard label="Pending" value={pendingCount} />
                <StatCard label="Confirmed" value={confirmedCount} />
                <StatCard label="Rejected" value={rejectedCount} />
                <StatCard label="Resolved" value={resolvedCount} />
            </div>
            <div className="mb-6">
                <StatCard label="Total Reports" value={totalReports} />
            </div>
            <h2 className="text-lg font-semibold mb-2">Latest Reports</h2>
            <ReportList reports={recentReports} />
        </div>
    );
}

function ReportList({ reports }: { reports: { id: number; title: string; status: string; user?: { name: string }; team?: { name: string } | null }[] }) {
    return (
        <div className="space-y-2">
            {reports.map((r) => (
                <Link key={r.id} href={`/reports/${r.id}`} className="block bg-white p-3 rounded shadow hover:shadow-md">
                    <div className="font-medium">{r.title}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <StatusBadge status={r.status as never} />
                        {'user' in r ? <span>by {r.user.name}</span> : null}
                        {'team' in r && r.team ? <span>— {r.team.name}</span> : null}
                    </div>
                </Link>
            ))}
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
