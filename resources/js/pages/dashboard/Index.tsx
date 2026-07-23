import AppLayout from '@/components/AppLayout';
import StatusBadge from '@/components/report/StatusBadge';
import { Link, usePage } from '@inertiajs/react';
import { FileText, Clock, Wrench, CheckCircle, Plus, ArrowRight } from 'lucide-react';
import type React from 'react';

export default function Dashboard() {
    const { props } = usePage();

    // ponytail: role-conditional rendering; if roles multiply, extract per-role widgets
    if ('totalReports' in props) {
        return <AdminDashboard />;
    }
    if ('assignedCount' in props) {
        return <TeacherDashboard />;
    }
    return <StudentDashboard />;
}

function StudentDashboard() {
    const { auth, myReportsCount, pendingCount, inProgressCount, resolvedCount, rejectedCount, recentReports } = usePage().props as {
        auth: { user: { name: string } };
        myReportsCount: number;
        pendingCount: number;
        inProgressCount: number;
        resolvedCount: number;
        rejectedCount: number;
        recentReports: { id: number; title: string; status: string; priority: string; created_at: string }[];
    };

    const stats = [
        { label: 'Total Reports', value: myReportsCount, icon: FileText, bg: 'bg-[#0F172A]', iconColor: 'text-white' },
        { label: 'Pending', value: pendingCount, icon: Clock, bg: 'bg-yellow-500', iconColor: 'text-white' },
        { label: 'In Progress', value: inProgressCount, icon: Wrench, bg: 'bg-orange-500', iconColor: 'text-white' },
        { label: 'Resolved', value: resolvedCount, icon: CheckCircle, bg: 'bg-green-500', iconColor: 'text-white' },
    ];

    function timeAgo(date: string): string {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    }

    return (
        <div>
            <div className="bg-[#0F172A] rounded-2xl p-6 mb-8">
                <h1 className="text-2xl font-bold text-white">Selamat Datang, {auth.user.name} 👋</h1>
                <p className="text-slate-400 mt-1">Kelola laporan keluhan sekolah kamu di sini</p>
                <div className="flex gap-3 mt-5">
                    <Link
                        href="/reports/create"
                        className="inline-flex items-center gap-2 bg-white text-[#0F172A] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Buat Laporan
                    </Link>
                    <Link
                        href="/reports"
                        className="inline-flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-white/20 transition-colors"
                    >
                        Lihat Riwayat
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                                <p className="text-3xl font-bold text-[#0F172A] mt-1">{stat.value}</p>
                            </div>
                            <div className={`${stat.bg} p-3 rounded-xl`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Laporan Terbaru</h2>
                    <Link href="/reports" className="text-sm text-[#0F172A] hover:underline font-medium flex items-center gap-1">
                        Lihat Semua <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {recentReports.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-gray-900 font-semibold">Belum ada laporan</p>
                        <p className="text-sm text-gray-500 mt-1">Mulai dengan mengirim laporan pertama kamu</p>
                        <Link
                            href="/reports/create"
                            className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-[#1a2540] transition-colors mt-5"
                        >
                            <Plus className="w-4 h-4" />
                            Buat Laporan
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                        {recentReports.map((report) => (
                            <Link
                                key={report.id}
                                href={`/reports/${report.id}`}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <StatusBadge status={report.status as never} />
                                    <div>
                                        <p className="font-medium text-gray-900">{report.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(report.created_at)}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                    report.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                    report.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                    report.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-100 text-gray-600'
                                }`}>
                                    {report.priority}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
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
            <div className="bg-[#0F172A] rounded-2xl p-6 mb-8">
                <h1 className="text-2xl font-bold text-white">Team Dashboard</h1>
                <p className="text-slate-400 mt-1">Tim: {teams.map((t) => t.name).join(', ')}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned</p>
                    <p className="text-3xl font-bold text-orange-500 mt-1">{assignedCount}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resolved</p>
                    <p className="text-3xl font-bold text-green-500 mt-1">{resolvedCount}</p>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Laporan Terbaru</h2>
                    <Link href="/team/reports" className="text-sm text-[#0F172A] hover:underline font-medium flex items-center gap-1">
                        Lihat Semua <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                {recentReports.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Belum ada laporan ditugaskan</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                        {recentReports.map((r) => (
                            <Link
                                key={r.id}
                                href={`/reports/${r.id}`}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <StatusBadge status={r.status as never} />
                                    <div>
                                        <p className="font-medium text-gray-900">{r.title}</p>
                                        {r.team && <p className="text-xs text-gray-400">{r.team.name}</p>}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
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
            <div className="bg-[#0F172A] rounded-2xl p-6 mb-8">
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-400 mt-1">Kelola semua laporan keluhan sekolah</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
                    <p className="text-3xl font-bold text-[#0F172A] mt-1">{totalReports}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
                    <p className="text-3xl font-bold text-yellow-500 mt-1">{pendingCount}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Confirmed</p>
                    <p className="text-3xl font-bold text-blue-500 mt-1">{confirmedCount}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rejected</p>
                    <p className="text-3xl font-bold text-red-500 mt-1">{rejectedCount}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resolved</p>
                    <p className="text-3xl font-bold text-green-500 mt-1">{resolvedCount}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Tim</h2>
                <div className="space-y-3">
                    {teams.map((team) => (
                        <div key={team.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="font-medium text-gray-900">{team.name}</span>
                            <span className="text-sm text-gray-500">{team.members.length} anggota</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Laporan Terbaru</h2>
                    <Link href="/admin/reports" className="text-sm text-[#0F172A] hover:underline font-medium flex items-center gap-1">
                        Lihat Semua <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                {recentReports.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Belum ada laporan</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                        {recentReports.map((r) => (
                            <Link
                                key={r.id}
                                href={`/reports/${r.id}`}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <StatusBadge status={r.status as never} />
                                    <div>
                                        <p className="font-medium text-gray-900">{r.title}</p>
                                        <p className="text-xs text-gray-400">oleh {r.user.name}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
