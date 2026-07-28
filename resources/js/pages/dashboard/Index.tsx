import { Link, usePage, usePoll } from '@inertiajs/react';
import {
    Search,
    HelpCircle,
    MessageSquare,
    PhoneCall,
    ChevronRight,
    Megaphone,
    Calendar,
} from 'lucide-react';
import type React from 'react';
import AppLayout from '@/components/AppLayout';

export default function Dashboard() {
    const { props } = usePage();

    usePoll(8000, {
        only: [
            'myReportsCount',
            'pendingCount',
            'inProgressCount',
            'resolvedCount',
            'assignedCount',
            'confirmedCount',
            'rejectedCount',
            'totalReports',
            'recentReports',
        ],
    });

    if ('totalReports' in props) {
        return <AdminDashboard />;
    }

    if ('assignedCount' in props) {
        return <TeacherDashboard />;
    }

    return <StudentDashboard />;
}

function StudentDashboard() {
    const {
        auth,
        myReportsCount,
        pendingCount,
        inProgressCount,
        resolvedCount,
        recentReports,
    } = usePage().props as {
        auth: { user: { name: string } };
        myReportsCount: number;
        pendingCount: number;
        inProgressCount: number;
        resolvedCount: number;
        recentReports: {
            id: number;
            title: string;
            status: string;
            priority: string;
            created_at: string;
        }[];
    };

    const formattedDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <div className="space-y-6">
            {/* Top Greeting Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                        Halo, {auth.user.name.split(' ')[0]}!
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Selamat datang kembali di pusat kendali laporan
                        fasilitas sekolah Anda.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-100 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm sm:self-auto">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formattedDate}</span>
                </div>
            </div>

            {/* Layout Main Grid (Left 2/3, Right 1/3) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column Area */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Main Banner Hero */}
                    <div className="relative overflow-hidden rounded-3xl bg-[#111827] p-6 text-white sm:p-8">
                        {/* Background SVG / Visual Graphic Shape */}
                        <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex w-1/2 items-center justify-center opacity-10">
                            <svg
                                className="h-full w-full text-white"
                                viewBox="0 0 200 200"
                                fill="currentColor"
                            >
                                <path
                                    d="M45,-62.5C57.4,-53.1,65.8,-38.8,70.2,-23.4C74.6,-8,75,8.5,69.5,23.3C64,38.1,52.6,51.2,38.8,60.1C25,69,8.8,73.7,-6.8,72.4C-22.4,71.1,-37.4,63.8,-49.8,53.2C-62.2,42.6,-72,28.7,-74.6,13.4C-77.2,-1.9,-72.6,-18.6,-63.9,-31.8C-55.2,-45,-42.4,-54.7,-28.9,-63.4C-15.4,-72,-1.2,-79.6,13.6,-77.3C28.4,-75,41.2,-62.8,45,-62.5Z"
                                    transform="translate(100 100)"
                                />
                            </svg>
                        </div>

                        <div className="relative z-10 max-w-lg">
                            <h2 className="text-xl leading-snug font-bold sm:text-2xl">
                                Temukan Masalah di Sekolah?
                            </h2>
                            <p className="mt-2 text-xs leading-relaxed text-gray-300 sm:text-sm">
                                Laporkan kerusakan fasilitas atau keluhan
                                kenyamanan kelas secara langsung untuk
                                penanganan yang lebih cepat dan transparan.
                            </p>
                            <Link
                                href="/reports/create"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-gray-900 shadow-sm transition-all hover:bg-gray-100 active:scale-95 sm:text-sm"
                            >
                                <Megaphone className="h-4 w-4 text-gray-900" />
                                Buat Laporan Baru
                            </Link>
                        </div>
                    </div>

                    {/* Grid Stats */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                TOTAL
                            </p>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-2xl font-extrabold text-gray-900">
                                    {myReportsCount || 0}
                                </span>
                                <span className="text-xs font-medium text-gray-400">
                                    Laporan
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                PENDING
                            </p>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-2xl font-extrabold text-amber-600">
                                    {pendingCount || 0}
                                </span>
                                <span className="text-xs font-medium text-amber-600/70">
                                    Antrian
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                PROSES
                            </p>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-2xl font-extrabold text-blue-600">
                                    {inProgressCount || 0}
                                </span>
                                <span className="text-xs font-medium text-blue-600/70">
                                    Aktif
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                SELESAI
                            </p>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-2xl font-extrabold text-emerald-600">
                                    {resolvedCount || 0}
                                </span>
                                <span className="text-xs font-medium text-emerald-600/70">
                                    Tuntas
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Table Laporan Terbaru */}
                    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-50 p-6">
                            <h3 className="text-base font-bold text-gray-900">
                                Laporan Terbaru
                            </h3>
                            <Link
                                href="/reports"
                                className="text-xs font-bold text-gray-600 transition-colors hover:text-gray-900"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="bg-gray-50/70 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                        <th className="px-6 py-3">
                                            ID LAPORAN
                                        </th>
                                        <th className="px-6 py-3">SUBJEK</th>
                                        <th className="px-6 py-3">TANGGAL</th>
                                        <th className="px-6 py-3">STATUS</th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-xs">
                                    {recentReports.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="py-8 text-center text-gray-400"
                                            >
                                                Belum ada laporan terbaru.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentReports.map((report) => (
                                            <tr
                                                key={report.id}
                                                className="group transition-colors hover:bg-gray-50/50"
                                            >
                                                <td className="px-6 py-4 font-bold text-gray-900">
                                                    #RP-{report.id}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-800">
                                                    {report.title}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(
                                                        report.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${
                                                            report.status ===
                                                            'resolved'
                                                                ? 'bg-emerald-50 text-emerald-600'
                                                                : report.status ===
                                                                    'in_progress'
                                                                  ? 'bg-blue-50 text-blue-600'
                                                                  : report.status ===
                                                                      'pending'
                                                                    ? 'bg-amber-50 text-amber-600'
                                                                    : 'bg-rose-50 text-rose-600'
                                                        }`}
                                                    >
                                                        {report.status ===
                                                        'in_progress'
                                                            ? 'Proses'
                                                            : report.status ===
                                                                'resolved'
                                                              ? 'Selesai'
                                                              : report.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <Link
                                                        href={`/reports/${report.id}`}
                                                    >
                                                        <ChevronRight className="inline-block h-4 w-4 text-gray-300 transition-colors group-hover:text-gray-600" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column / Sidebar Area */}
                <div className="space-y-6">
                    {/* Widget: Butuh Bantuan? */}
                    <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                <HelpCircle className="h-5 w-5 text-gray-700" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">
                                Butuh Bantuan?
                            </h3>
                        </div>

                        <p className="text-xs leading-relaxed text-gray-500">
                            Tim sarana dan prasarana siap membantu koordinasi
                            perbaikan di area sekolah.
                        </p>

                        <div className="space-y-3 pt-2">
                            <div className="flex items-start gap-3">
                                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-gray-700" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">
                                        Chat Support
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                        Respons cepat 08:00 - 16:00
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-gray-700" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">
                                        Hotline Sekolah
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                        Darurat Infrastruktur
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Widget: Quote Card Bergambar */}
                    <div className="group relative h-40 overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
                        <img
                            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800"
                            alt="Perpustakaan Sekolah"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5">
                            <p className="text-xs leading-snug font-semibold text-white italic">
                                "Fasilitas yang baik mendukung proses belajar
                                yang optimal."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TeacherDashboard() {
    return <StudentDashboard />;
}

function AdminDashboard() {
    return <StudentDashboard />;
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
