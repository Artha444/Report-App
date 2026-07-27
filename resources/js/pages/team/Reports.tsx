import AppLayout from '@/components/AppLayout';
import StatusBadge from '@/components/report/StatusBadge';
import ResolveForm from '@/components/report/ResolveForm';
import { Link, useForm, usePage } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';
import { ClipboardCheck, ArrowRight, Play } from 'lucide-react';

type Report = {
    id: number;
    title: string;
    status: string;
    priority: string;
    team: { name: string } | null;
    user: { name: string };
    created_at: string;
};

const statusTabs = [
    { key: 'all', label: 'Semua' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
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

export default function TeamReports() {
    const { reports } = usePage().props as {
        reports: { data: Report[]; links: { url: string | null; label: string; active: boolean }[] };
    };
    const { post } = useForm();
    const [activeTab, setActiveTab] = useState('all');

    const filtered = activeTab === 'all'
        ? reports.data
        : reports.data.filter((r) => r.status === activeTab);

    const counts = reports.data.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1a2d4a] to-[#0F172A] p-6 sm:p-8">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                        <ClipboardCheck className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Team Reports</h1>
                        <p className="text-slate-400 text-sm mt-0.5">Laporan yang ditugaskan ke tim kamu</p>
                    </div>
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
                            <ClipboardCheck className="w-7 h-7 text-slate-400" />
                        </div>
                        <p className="font-bold text-gray-900">Tidak ada laporan</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {activeTab === 'all' ? 'Belum ada laporan untuk tim kamu' : `Tidak ada laporan dengan status ${activeTab}`}
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
                            <div
                                key={report.id}
                                className={`bg-white rounded-2xl p-4 border-l-4 ${borderColor} hover:shadow-md transition-all`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/reports/${report.id}`}
                                            className="font-semibold text-gray-900 text-sm hover:text-[#0F172A] transition-colors"
                                        >
                                            {report.title}
                                        </Link>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            oleh <span className="text-gray-600 font-medium">{report.user.name}</span>
                                            {' · '}
                                            {timeAgo(report.created_at)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                            <StatusBadge status={report.status as never} />
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

                                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                                        <Link
                                            href={`/reports/${report.id}`}
                                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#0F172A] transition-colors"
                                        >
                                            Lihat
                                            <ArrowRight className="w-3 h-3" />
                                        </Link>

                                        {report.status === 'confirmed' && (
                                            <button
                                                onClick={() => post(`/team/reports/${report.id}/in-progress`)}
                                                className="flex items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1.5 text-xs font-medium text-orange-700 transition hover:bg-orange-100 active:scale-95"
                                            >
                                                <Play className="w-3 h-3" />
                                                Start
                                            </button>
                                        )}

                                        {report.status === 'in_progress' && (
                                            <ResolveForm reportId={report.id} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {reports.links && reports.links.length > 3 && (
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
        </div>
    );
}

TeamReports.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
