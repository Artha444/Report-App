import AppLayout from '@/components/AppLayout';
import { Link } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';
import {
    Search,
    SlidersHorizontal,
    Folder,
    MoreHorizontal,
    RotateCw,
    CheckCircle2,
    Calendar,
    MapPin,
    ChevronRight,
    ChevronLeft,
    FileText
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
    const [activeFilter, setActiveFilter] = useState<'all' | 'latest' | 'priority'>('all');

    // Filter berdasarkan kata kunci pencarian
    const filteredReports = reports.data.filter((report) => {
        const matchesSearch =
            report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (report.location && report.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (report.description && report.description.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesSearch;
    });

    // Hitung statistik status
    const totalCount = reports.total || reports.data.length;
    const pendingCount = reports.data.filter((r) => r.status === 'pending').length;
    const inProgressCount = reports.data.filter((r) => r.status === 'in_progress' || r.status === 'confirmed').length;
    const resolvedCount = reports.data.filter((r) => r.status === 'resolved').length;

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
        <div className="space-y-6 max-w-[1200px] mx-auto pb-12">
            {/* Top Bar: Search Input */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari laporan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100/80 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder-gray-400 transition-all"
                    />
                </div>
            </div>

            {/* Header Section */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                         Laporan
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Pantau status dan perkembangan semua laporan Anda secara real-time.
                </p>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Laporan */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500">Total Laporan</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{totalCount}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700">
                        <Folder className="w-5 h-5" />
                    </div>
                </div>

                {/* Pending */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500">Pending</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{pendingCount}</p>
                    </div>
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                        <MoreHorizontal className="w-5 h-5" />
                    </div>
                </div>

                {/* Proses */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500">Proses</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{inProgressCount}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <RotateCw className="w-5 h-5" />
                    </div>
                </div>

                {/* Selesai */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500">Selesai</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{resolvedCount}</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Filter Tabs & Options */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeFilter === 'all'
                                ? 'bg-black text-white shadow-sm'
                                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                        }`}
                    >
                        Semua
                    </button>
                    <button
                        onClick={() => setActiveFilter('latest')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeFilter === 'latest'
                                ? 'bg-black text-white shadow-sm'
                                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                        }`}
                    >
                        Terbaru
                    </button>
                    <button
                        onClick={() => setActiveFilter('priority')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeFilter === 'priority'
                                ? 'bg-black text-white shadow-sm'
                                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                        }`}
                    >
                        Prioritas
                    </button>
                </div>

                <button className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filter Lanjutan</span>
                </button>
            </div>

            <div className="relative mb-4 ">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari laporan..."
                        className="w-full bg-white-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                    />
            </div>

            {/* Report Cards List */}
            {filteredReports.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-400">
                        <FileText className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-gray-900 text-sm">Tidak ada laporan ditemukan</p>
                    <p className="text-xs text-gray-400 mt-1">Coba sesuaikan kata kunci atau filter pencarian Anda.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReports.map((report) => (
                        <Link
                            key={report.id}
                            href={`/reports/${report.id}`}
                            className="block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex flex-col gap-3">
                                {/* Title and Status Badge */}
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="font-bold text-gray-900 text-base group-hover:text-black transition-colors">
                                        {report.title}
                                    </h3>
                                    <span
                                        className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold capitalize ${
                                            report.status === 'pending'
                                                ? 'bg-amber-100/70 text-amber-800'
                                                : report.status === 'in_progress' || report.status === 'confirmed'
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
                                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                        <span>{formatDate(report.created_at)}</span>
                                    </div>
                                    {report.location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                            <span>{report.location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Short Description */}
                                {report.description && (
                                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                        {report.description}
                                    </p>
                                )}

                                {/* Footer / Extra Info Note & Action Arrow */}
                                <div className="pt-3 mt-1 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {report.assignee_avatar && (
                                            <img
                                                src={report.assignee_avatar}
                                                alt="Assignee"
                                                className="w-5 h-5 rounded-full object-cover"
                                            />
                                        )}
                                        {report.latest_note && (
                                            <span className="text-[11px] font-medium text-blue-600">
                                                {report.latest_note}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all ml-auto">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <p className="text-xs font-medium text-gray-500">
                    Menampilkan {filteredReports.length} dari {totalCount} laporan
                </p>

                {reports.links && reports.links.length > 3 && (
                    <div className="flex items-center gap-1">
                        {reports.links.map((link, idx) => {
                            const isPrevious = link.label.includes('Previous') || link.label.includes('&laquo;');
                            const isNext = link.label.includes('Next') || link.label.includes('&raquo;');

                            if (!link.url) {
                                return (
                                    <span
                                        key={idx}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-xs text-gray-300 font-medium"
                                    >
                                        {isPrevious ? <ChevronLeft className="w-4 h-4" /> : isNext ? <ChevronRight className="w-4 h-4" /> : link.label}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                        link.active
                                            ? 'bg-black text-white'
                                            : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {isPrevious ? (
                                        <ChevronLeft className="w-4 h-4" />
                                    ) : isNext ? (
                                        <ChevronRight className="w-4 h-4" />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
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
