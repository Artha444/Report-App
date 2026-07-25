import AppLayout from '@/components/AppLayout';
import StatusBadge from '@/components/report/StatusBadge';
import { Link, usePage } from '@inertiajs/react';
import { FileText, Clock, Wrench, CheckCircle, Plus, ArrowRight, Send, Hand } from 'lucide-react';
import type React from 'react';

export default function Dashboard() {
    const { props } = usePage();

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
        { label: 'Total', value: myReportsCount, color: 'bg-[#0F172A]', textColor: 'text-[#0F172A]' },
        { label: 'Pending', value: pendingCount, color: 'bg-yellow-500', textColor: 'text-yellow-500' },
        { label: 'Proses', value: inProgressCount, color: 'bg-orange-500', textColor: 'text-orange-500' },
        { label: 'Selesai', value: resolvedCount, color: 'bg-green-500', textColor: 'text-green-500' },
    ];

    function timeAgo(date: string): string {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return 'baru saja';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m lalu`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}j lalu`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}h lalu`;
        return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }

    return (
        <div className="space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1a2d4a] to-[#0F172A] p-6 sm:p-8">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2">
                        <p className="text-slate-400 text-sm font-medium">Halo, {auth.user.name.split(' ')[0]}</p>
                        <Hand className="w-4 h-4 text-yellow-400" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Ada yang bisa dibantu?</h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-md">Sampaikan keluhan atau masalah sekolah kamu, kami akan segera menindaklanjuti.</p>
                    <Link
                        href="/reports/create"
                        className="inline-flex items-center gap-2 bg-white text-[#0F172A] px-6 py-3 rounded-2xl font-semibold text-sm mt-5 hover:bg-slate-100 transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Buat Laporan Baru
                    </Link>
                </div>
            </div>

            {/* Stats — horizontal scroll on mobile */}
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 -mx-1 px-1 md:grid md:grid-cols-4 md:overflow-visible md:mx-0 md:px-0">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="min-w-[130px] snap-start bg-white rounded-2xl p-4 flex flex-col gap-2 shrink-0 md:min-w-0"
                    >
                        <div className={`w-2 h-8 rounded-full ${stat.color}`} />
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick CTA */}
            <Link
                href="/reports"
                className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-5 hover:from-slate-100 hover:to-slate-200 transition-all group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-[#0F172A] rounded-xl flex items-center justify-center shrink-0">
                        <Send className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">Riwayat Laporan</p>
                        <p className="text-xs text-gray-500 mt-0.5">Cek status semua laporan kamu</p>
                    </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0F172A] group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Recent Reports */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-gray-900">Laporan Terbaru</h2>
                    {recentReports.length > 0 && (
                        <Link href="/reports" className="text-xs text-[#0F172A] font-semibold hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-3 h-3" />
                        </Link>
                    )}
                </div>

                {recentReports.length === 0 ? (
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-10 text-center">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#0F172A]/5 rounded-full" />
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
                                <FileText className="w-7 h-7 text-slate-400" />
                            </div>
                            <p className="font-bold text-gray-900">Belum ada laporan</p>
                            <p className="text-sm text-gray-500 mt-1">Mulai ceritakan masalah yang kamu hadapi</p>
                            <Link
                                href="/reports/create"
                                className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-[#1a2540] transition-all mt-4 active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                Buat Sekarang
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentReports.map((report) => {
                            const borderColor =
                                report.status === 'resolved' ? 'border-l-green-500' :
                                report.status === 'in_progress' ? 'border-l-orange-500' :
                                report.status === 'pending' ? 'border-l-yellow-500' :
                                report.status === 'rejected' ? 'border-l-red-500' :
                                'border-l-blue-500';

                            return (
                                <Link
                                    key={report.id}
                                    href={`/reports/${report.id}`}
                                    className={`block bg-white rounded-2xl p-4 border-l-4 ${borderColor} hover:shadow-md transition-all active:scale-[0.98]`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm truncate">{report.title}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <StatusBadge status={report.status as never} />
                                                <span className="text-[11px] text-gray-400">{timeAgo(report.created_at)}</span>
                                            </div>
                                        </div>
                                        <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg shrink-0 ${
                                            report.priority === 'critical' ? 'bg-red-50 text-red-600' :
                                            report.priority === 'high' ? 'bg-orange-50 text-orange-600' :
                                            report.priority === 'medium' ? 'bg-blue-50 text-blue-600' :
                                            'bg-gray-50 text-gray-500'
                                        }`}>
                                            {report.priority}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
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
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1a2d4a] to-[#0F172A] p-6 sm:p-8">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="relative z-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Team Dashboard</h1>
                    <p className="text-slate-400 mt-1 text-sm">Tim: {teams.map((t) => t.name).join(', ')}</p>
                </div>
            </div>

            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 md:grid md:grid-cols-2 md:overflow-visible">
                <div className="min-w-[150px] snap-start bg-white rounded-2xl p-4 flex flex-col gap-2 shrink-0 md:min-w-0">
                    <div className="w-2 h-8 rounded-full bg-orange-500" />
                    <p className="text-2xl font-bold text-gray-900">{assignedCount}</p>
                    <p className="text-xs text-gray-500 font-medium">Assigned</p>
                </div>
                <div className="min-w-[150px] snap-start bg-white rounded-2xl p-4 flex flex-col gap-2 shrink-0 md:min-w-0">
                    <div className="w-2 h-8 rounded-full bg-green-500" />
                    <p className="text-2xl font-bold text-gray-900">{resolvedCount}</p>
                    <p className="text-xs text-gray-500 font-medium">Resolved</p>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-gray-900">Laporan Terbaru</h2>
                    {recentReports.length > 0 && (
                        <Link href="/team/reports" className="text-xs text-[#0F172A] font-semibold hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-3 h-3" />
                        </Link>
                    )}
                </div>
                {recentReports.length === 0 ? (
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-10 text-center">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Belum ada laporan ditugaskan</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentReports.map((r) => {
                            const borderColor =
                                r.status === 'resolved' ? 'border-l-green-500' :
                                r.status === 'in_progress' ? 'border-l-orange-500' :
                                r.status === 'pending' ? 'border-l-yellow-500' :
                                'border-l-blue-500';

                            return (
                                <Link
                                    key={r.id}
                                    href={`/reports/${r.id}`}
                                    className={`block bg-white rounded-2xl p-4 border-l-4 ${borderColor} hover:shadow-md transition-all active:scale-[0.98]`}
                                >
                                    <p className="font-semibold text-gray-900 text-sm">{r.title}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <StatusBadge status={r.status as never} />
                                        {r.team && <span className="text-[11px] text-gray-400">{r.team.name}</span>}
                                    </div>
                                </Link>
                            );
                        })}
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
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1a2d4a] to-[#0F172A] p-6 sm:p-8">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="relative z-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-slate-400 mt-1 text-sm">Kelola semua laporan keluhan sekolah</p>
                </div>
            </div>

            {/* Total prominently */}
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0F172A] rounded-2xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium">Total Laporan</p>
                    <p className="text-3xl font-bold text-[#0F172A]">{totalReports}</p>
                </div>
            </div>

            {/* Status breakdown — scroll on mobile */}
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 md:grid md:grid-cols-4 md:overflow-visible">
                {[
                    { label: 'Pending', value: pendingCount, color: 'bg-yellow-500' },
                    { label: 'Confirmed', value: confirmedCount, color: 'bg-blue-500' },
                    { label: 'Rejected', value: rejectedCount, color: 'bg-red-500' },
                    { label: 'Resolved', value: resolvedCount, color: 'bg-green-500' },
                ].map((stat) => (
                    <div key={stat.label} className="min-w-[130px] snap-start bg-white rounded-2xl p-4 flex flex-col gap-2 shrink-0 md:min-w-0">
                        <div className={`w-2 h-8 rounded-full ${stat.color}`} />
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Teams */}
            <div>
                <h2 className="text-base font-bold text-gray-900 mb-3">Tim</h2>
                <div className="space-y-2">
                    {teams.map((team) => (
                        <div key={team.id} className="bg-white rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-sm font-bold text-[#0F172A]">
                                    {team.name.charAt(0)}
                                </div>
                                <span className="font-semibold text-sm text-gray-900">{team.name}</span>
                            </div>
                            <span className="text-xs text-gray-400">{team.members.length} anggota</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Reports */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-gray-900">Laporan Terbaru</h2>
                    {recentReports.length > 0 && (
                        <Link href="/admin/reports" className="text-xs text-[#0F172A] font-semibold hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-3 h-3" />
                        </Link>
                    )}
                </div>
                {recentReports.length === 0 ? (
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-10 text-center">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Belum ada laporan</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentReports.map((r) => {
                            const borderColor =
                                r.status === 'resolved' ? 'border-l-green-500' :
                                r.status === 'in_progress' ? 'border-l-orange-500' :
                                r.status === 'pending' ? 'border-l-yellow-500' :
                                r.status === 'rejected' ? 'border-l-red-500' :
                                'border-l-blue-500';

                            return (
                                <Link
                                    key={r.id}
                                    href={`/reports/${r.id}`}
                                    className={`block bg-white rounded-2xl p-4 border-l-4 ${borderColor} hover:shadow-md transition-all active:scale-[0.98]`}
                                >
                                    <p className="font-semibold text-gray-900 text-sm">{r.title}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <StatusBadge status={r.status as never} />
                                        <span className="text-[11px] text-gray-400">oleh {r.user.name}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
