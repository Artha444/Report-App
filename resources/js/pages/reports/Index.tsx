import AppLayout from '@/components/AppLayout';
import { Link, usePoll } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';
import {
    Search,
    Folder,
    MoreHorizontal,
    RotateCw,
    CheckCircle2,
    Calendar,
    MapPin,
    ChevronRight,
    ChevronLeft,
    FileText,
} from 'lucide-react';

type Report = {
    id: number;
    title: string;
    description?: string;
    location?: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected' | string;
    priority: string;
    created_at: string;
    latest_note?: string;
    assignee_avatar?: string;
};

type Props = {
    reports: {
        data: Report[];
        links: { url: string | null; label: string; active: boolean }[];
        total?: number;
    };
};

export default function ReportIndex({ reports }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<
        'all' | 'pending' | 'in_progress' | 'resolved' | 'rejected'
    >('all');

    usePoll(5000, { only: ['reports'] });

    // Filter berdasarkan kata kunci pencarian + status
    const filteredReports = reports.data.filter((report) => {
        const matchesSearch =
            report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (report.location &&
                report.location
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) ||
            (report.description &&
                report.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()));

        const matchesFilter =
            activeFilter === 'all' ||
            report.status === activeFilter ||
            (activeFilter === 'in_progress' && report.status === 'confirmed');

        return matchesSearch && matchesFilter;
    });

    // Hitung statistik status
    const totalCount = reports.total || reports.data.length;
    const pendingCount = reports.data.filter(
        (r) => r.status === 'pending',
    ).length;
    const inProgressCount = reports.data.filter(
        (r) => r.status === 'in_progress' || r.status === 'confirmed',
    ).length;
    const resolvedCount = reports.data.filter(
        (r) => r.status === 'resolved',
    ).length;

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="mx-auto max-w-[1200px] space-y-6 pb-12">
            {/* Top Bar: Search Input */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari laporan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border-none bg-gray-100/80 py-2 pr-4 pl-10 text-xs font-medium placeholder-gray-400 transition-all focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                    />
                </div>
            </div>

            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                    Riwayat Laporan
                </h1>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Pantau status dan perkembangan semua laporan Anda secara
                    real-time.
                </p>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {/* Total Laporan */}
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div>
                        <p className="text-xs font-medium text-gray-500">
                            Total Laporan
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                            {totalCount}
                        </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                        <Folder className="h-5 w-5" />
                    </div>
                </div>

                {/* Pending */}
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div>
                        <p className="text-xs font-medium text-gray-500">
                            Pending
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                            {pendingCount}
                        </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <MoreHorizontal className="h-5 w-5" />
                    </div>
                </div>

                {/* Proses */}
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div>
                        <p className="text-xs font-medium text-gray-500">
                            Proses
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                            {inProgressCount}
                        </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <RotateCw className="h-5 w-5" />
                    </div>
                </div>

                {/* Selesai */}
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div>
                        <p className="text-xs font-medium text-gray-500">
                            Selesai
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                            {resolvedCount}
                        </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2">
                {(
                    [
                        ['all', 'Semua'],
                        ['pending', 'Pending'],
                        ['in_progress', 'Proses'],
                        ['resolved', 'Selesai'],
                        ['rejected', 'Ditolak'],
                    ] as const
                ).map(([value, label]) => (
                    <button
                        key={value}
                        onClick={() => setActiveFilter(value)}
                        className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                            activeFilter === value
                                ? 'bg-black text-white shadow-sm'
                                : 'border border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Report Cards List */}
            {filteredReports.length === 0 ? (
                <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                        <FileText className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                        Tidak ada laporan ditemukan
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Coba sesuaikan kata kunci atau filter pencarian Anda.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReports.map((report) => (
                        <Link
                            key={report.id}
                            href={`/reports/${report.id}`}
                            className="group block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="flex flex-col gap-3">
                                {/* Title and Status Badge */}
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-black">
                                        {report.title}
                                    </h3>
                                    <span
                                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${
                                            report.status === 'pending'
                                                ? 'bg-amber-100/70 text-amber-800'
                                                : report.status ===
                                                        'in_progress' ||
                                                    report.status ===
                                                        'confirmed'
                                                  ? 'bg-blue-100/70 text-blue-700'
                                                  : report.status === 'resolved'
                                                    ? 'bg-emerald-100/70 text-emerald-700'
                                                    : 'bg-rose-100/70 text-rose-700'
                                        }`}
                                    >
                                        {report.status === 'in_progress'
                                            ? 'Proses'
                                            : report.status === 'resolved'
                                              ? 'Selesai'
                                              : report.status === 'pending'
                                                ? 'Pending'
                                                : report.status}
                                    </span>
                                </div>

                                {/* Meta Info: Date and Location */}
                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                        <span>
                                            {formatDate(report.created_at)}
                                        </span>
                                    </div>
                                    {report.location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                            <span>{report.location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Short Description */}
                                {report.description && (
                                    <p className="line-clamp-2 text-xs leading-relaxed text-gray-600">
                                        {report.description}
                                    </p>
                                )}

                                {/* Footer / Extra Info Note & Action Arrow */}
                                <div className="mt-1 flex items-center justify-between border-t border-gray-50 pt-3">
                                    <div className="flex items-center gap-2">
                                        {report.assignee_avatar && (
                                            <img
                                                src={report.assignee_avatar}
                                                alt="Assignee"
                                                className="h-5 w-5 rounded-full object-cover"
                                            />
                                        )}
                                        {report.latest_note && (
                                            <span className="text-[11px] font-medium text-blue-600">
                                                {report.latest_note}
                                            </span>
                                        )}
                                    </div>

                                    <div className="ml-auto flex items-center gap-1 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-gray-900">
                                        <ChevronRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination Footer */}
            <div className="flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row">
                <p className="text-xs font-medium text-gray-500">
                    Menampilkan {filteredReports.length} dari {totalCount}{' '}
                    laporan
                </p>

                {reports.links && reports.links.length > 3 && (
                    <div className="flex items-center gap-1">
                        {reports.links.map((link, idx) => {
                            const isPrevious =
                                link.label.includes('Previous') ||
                                link.label.includes('&laquo;');
                            const isNext =
                                link.label.includes('Next') ||
                                link.label.includes('&raquo;');

                            if (!link.url) {
                                return (
                                    <span
                                        key={idx}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-gray-300"
                                    >
                                        {isPrevious ? (
                                            <ChevronLeft className="h-4 w-4" />
                                        ) : isNext ? (
                                            <ChevronRight className="h-4 w-4" />
                                        ) : (
                                            link.label
                                        )}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                        link.active
                                            ? 'bg-black text-white'
                                            : 'border border-gray-100 bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {isPrevious ? (
                                        <ChevronLeft className="h-4 w-4" />
                                    ) : isNext ? (
                                        <ChevronRight className="h-4 w-4" />
                                    ) : (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

ReportIndex.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
