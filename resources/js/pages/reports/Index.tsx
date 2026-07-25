import AppLayout from '@/components/AppLayout';
import StatusBadge from '@/components/report/StatusBadge';
import { Link } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';
import { Plus, FileText, ArrowRight } from 'lucide-react';

type Report = {
    id: number;
    title: string;
    status: string;
    priority: string;
    created_at: string;
};

type Props = {
    reports: {
        data: Report[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

const statusTabs = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'rejected', label: 'Rejected' },
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
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ReportIndex({ reports }: Props) {
    const [activeTab, setActiveTab] = useState('all');

    const filtered = activeTab === 'all'
        ? reports.data
        : reports.data.filter((r) => r.status === activeTab);

    const counts = reports.data.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1a2d4a] to-[#0F172A] p-6 sm:p-8">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="relative z-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Riwayat Laporan</h1>
                    <p className="text-slate-400 text-sm mt-1">Semua laporan yang pernah kamu kirim</p>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
                {statusTabs.map((tab) => {
                    const count = tab.key === 'all' ? reports.data.length : (counts[tab.key] || 0);
                    const active = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`snap-start shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                active
                                    ? 'bg-[#0F172A] text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {tab.label}
                            <span className={`text-xs px-1.5 py-0.5 rounded-lg ${
                                active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Report Cards */}
            {filtered.length === 0 ? (
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-10 text-center">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#0F172A]/5 rounded-full" />
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
                            <FileText className="w-7 h-7 text-slate-400" />
                        </div>
                        <p className="font-bold text-gray-900">Tidak ada laporan</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {activeTab === 'all' ? 'Kamu belum pernah mengirim laporan' : `Tidak ada laporan dengan status ${activeTab}`}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((report) => {
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
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm">{report.title}</p>
                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                            <StatusBadge status={report.status as never} />
                                            <span className="text-[11px] text-gray-400">{timeAgo(report.created_at)}</span>
                                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${
                                                report.priority === 'critical' ? 'bg-red-50 text-red-600' :
                                                report.priority === 'high' ? 'bg-orange-50 text-orange-600' :
                                                report.priority === 'medium' ? 'bg-blue-50 text-blue-600' :
                                                'bg-gray-50 text-gray-500'
                                            }`}>
                                                {report.priority}
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 self-center sm:self-start hidden sm:block" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {reports.links.length > 3 && (
                <div className="flex gap-1.5 justify-center flex-wrap">
                    {reports.links.map((l, i) =>
                        l.url ? (
                            <Link
                                key={i}
                                href={l.url}
                                className={`min-w-[36px] h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                                    l.active
                                        ? 'bg-[#0F172A] text-white shadow-md'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                                dangerouslySetInnerHTML={{ __html: l.label }}
                            />
                        ) : (
                            <span
                                key={i}
                                className="min-w-[36px] h-9 flex items-center justify-center rounded-xl text-sm text-gray-300"
                                dangerouslySetInnerHTML={{ __html: l.label }}
                            />
                        )
                    )}
                </div>
            )}

            {/* FAB */}
            <Link
                href="/reports/create"
                className="fixed bottom-6 right-6 w-14 h-14 bg-[#0F172A] text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-[#1a2540] transition-all active:scale-95 md:hidden z-30"
            >
                <Plus className="w-6 h-6" />
            </Link>
        </div>
    );
}

ReportIndex.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
