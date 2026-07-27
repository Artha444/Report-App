import AppLayout from '@/components/AppLayout';
import { Link, usePage, usePoll } from '@inertiajs/react';
import {
    Search,
    HelpCircle,
    MessageSquare,
    PhoneCall,
    ChevronRight,
    Megaphone,
    Calendar
} from 'lucide-react';
import type React from 'react';

export default function Dashboard() {
    const { props } = usePage();

    usePoll(8000, {
        only: [
            'myReportsCount', 'pendingCount', 'inProgressCount', 'resolvedCount',
            'assignedCount', 'confirmedCount', 'rejectedCount', 'totalReports',
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
    const { auth, myReportsCount, pendingCount, inProgressCount, resolvedCount, recentReports } = usePage().props as {
        auth: { user: { name: string } };
        myReportsCount: number;
        pendingCount: number;
        inProgressCount: number;
        resolvedCount: number;
        recentReports: { id: number; title: string; status: string; priority: string; created_at: string }[];
    };

    const formattedDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <div className="space-y-6">
            {/* Top Greeting Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Halo, {auth.user.name.split(' ')[0]}!
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Selamat datang kembali di pusat kendali laporan fasilitas sekolah Anda.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-xs font-semibold text-gray-700 self-start sm:self-auto">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{formattedDate}</span>
                </div>
            </div>

            {/* Layout Main Grid (Left 2/3, Right 1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Banner Hero */}
                    <div className="relative overflow-hidden rounded-3xl bg-[#111827] text-white p-6 sm:p-8">
                        {/* Background SVG / Visual Graphic Shape */}
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none flex items-center justify-center">
                            <svg className="w-full h-full text-white" viewBox="0 0 200 200" fill="currentColor">
                                <path d="M45,-62.5C57.4,-53.1,65.8,-38.8,70.2,-23.4C74.6,-8,75,8.5,69.5,23.3C64,38.1,52.6,51.2,38.8,60.1C25,69,8.8,73.7,-6.8,72.4C-22.4,71.1,-37.4,63.8,-49.8,53.2C-62.2,42.6,-72,28.7,-74.6,13.4C-77.2,-1.9,-72.6,-18.6,-63.9,-31.8C-55.2,-45,-42.4,-54.7,-28.9,-63.4C-15.4,-72,-1.2,-79.6,13.6,-77.3C28.4,-75,41.2,-62.8,45,-62.5Z" transform="translate(100 100)" />
                            </svg>
                        </div>

                        <div className="relative z-10 max-w-lg">
                            <h2 className="text-xl sm:text-2xl font-bold leading-snug">
                                Temukan Masalah di Sekolah?
                            </h2>
                            <p className="text-gray-300 text-xs sm:text-sm mt-2 leading-relaxed">
                                Laporkan kerusakan fasilitas atau keluhan kenyamanan kelas secara langsung untuk penanganan yang lebih cepat dan transparan.
                            </p>
                            <Link
                                href="/reports/create"
                                className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm mt-6 hover:bg-gray-100 transition-all shadow-sm active:scale-95"
                            >
                                <Megaphone className="w-4 h-4 text-gray-900" />
                                Buat Laporan Baru
                            </Link>
                        </div>
                    </div>

                    {/* Grid Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">TOTAL</p>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-2xl font-extrabold text-gray-900">{myReportsCount || 0}</span>
                                <span className="text-xs text-gray-400 font-medium">Laporan</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">PENDING</p>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-2xl font-extrabold text-amber-600">{pendingCount || 0}</span>
                                <span className="text-xs text-amber-600/70 font-medium">Antrian</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">PROSES</p>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-2xl font-extrabold text-blue-600">{inProgressCount || 0}</span>
                                <span className="text-xs text-blue-600/70 font-medium">Aktif</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">SELESAI</p>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-2xl font-extrabold text-emerald-600">{resolvedCount || 0}</span>
                                <span className="text-xs text-emerald-600/70 font-medium">Tuntas</span>
                            </div>
                        </div>
                    </div>

                    {/* Table Laporan Terbaru */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 flex items-center justify-between border-b border-gray-50">
                            <h3 className="font-bold text-gray-900 text-base">Laporan Terbaru</h3>
                            <Link href="/reports" className="text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors">
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/70 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        <th className="py-3 px-6">ID LAPORAN</th>
                                        <th className="py-3 px-6">SUBJEK</th>
                                        <th className="py-3 px-6">TANGGAL</th>
                                        <th className="py-3 px-6">STATUS</th>
                                        <th className="py-3 px-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-xs">
                                    {recentReports.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-400">
                                                Belum ada laporan terbaru.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentReports.map((report) => (
                                            <tr key={report.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="py-4 px-6 font-bold text-gray-900">
                                                    #RP-{report.id}
                                                </td>
                                                <td className="py-4 px-6 font-medium text-gray-800">
                                                    {report.title}
                                                </td>
                                                <td className="py-4 px-6 text-gray-500">
                                                    {new Date(report.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold capitalize ${
                                                        report.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' :
                                                        report.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                                                        report.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-rose-50 text-rose-600'
                                                    }`}>
                                                        {report.status === 'in_progress' ? 'Proses' :
                                                         report.status === 'resolved' ? 'Selesai' : report.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <Link href={`/reports/${report.id}`}>
                                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors inline-block" />
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
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                <HelpCircle className="w-5 h-5 text-gray-700" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-base">Butuh Bantuan?</h3>
                        </div>

                        <p className="text-xs text-gray-500 leading-relaxed">
                            Tim sarana dan prasarana siap membantu koordinasi perbaikan di area sekolah.
                        </p>

                        <div className="space-y-3 pt-2">
                            <div className="flex items-start gap-3">
                                <MessageSquare className="w-4 h-4 text-gray-700 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Chat Support</p>
                                    <p className="text-[11px] text-gray-400">Respons cepat 08:00 - 16:00</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <PhoneCall className="w-4 h-4 text-gray-700 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Hotline Sekolah</p>
                                    <p className="text-[11px] text-gray-400">Darurat Infrastruktur</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Widget: Quote Card Bergambar */}
                    <div className="relative rounded-3xl overflow-hidden h-40 shadow-sm border border-gray-100 group">
                        <img
                            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800"
                            alt="Perpustakaan Sekolah"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-5">
                            <p className="text-white text-xs font-semibold leading-snug italic">
                                "Fasilitas yang baik mendukung proses belajar yang optimal."
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
