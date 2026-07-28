import AppLayout from '@/components/AppLayout';
import { Link, usePage, useForm } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    ImagePlus,
    LayoutDashboard,
    UploadCloud,
    X
} from 'lucide-react';
import React, { useState } from 'react';

interface User {
    name: string;
}

interface Team {
    name: string;
}

interface Report {
    id: number;
    title: string;
    status: string;
    user: User;
    team: Team | null;
    created_at: string;
}

interface PageProps {
    auth: { user: User };
    assignedCount: number;
    resolvedCount: number;
    recentReports: Report[];
}

export default function TeamDashboard() {
    const { auth, assignedCount, resolvedCount, recentReports } = usePage().props as unknown as PageProps;
    const formattedDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    // Modal state
    const [resolvingReport, setResolvingReport] = useState<Report | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<{
        resolution_evidence: File | null;
        resolution_notes: string;
    }>({
        resolution_evidence: null,
        resolution_notes: '',
    });

    const openResolveModal = (report: Report) => {
        setResolvingReport(report);
        clearErrors();
        reset();
    };

    const closeResolveModal = () => {
        setResolvingReport(null);
        clearErrors();
        reset();
    };

    const submitResolve = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resolvingReport) return;

        post(`/team/reports/${resolvingReport.id}/resolve`, {
            preserveScroll: true,
            onSuccess: () => closeResolveModal(),
        });
    };

    return (
        <div className="space-y-6 relative">
            {/* Top Greeting Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Halo, Tim {auth.user.name.split(' ')[0]}!
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Selamat datang di Dashboard Tim. Periksa tugas yang perlu Anda selesaikan.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-xs font-semibold text-gray-700 self-start sm:self-auto">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{formattedDate}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Banner Hero */}
                    <div className="relative overflow-hidden rounded-3xl bg-[#111827] text-white p-6 sm:p-8">
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none flex items-center justify-center">
                            <svg className="w-full h-full text-white" viewBox="0 0 200 200" fill="currentColor">
                                <path d="M45,-62.5C57.4,-53.1,65.8,-38.8,70.2,-23.4C74.6,-8,75,8.5,69.5,23.3C64,38.1,52.6,51.2,38.8,60.1C25,69,8.8,73.7,-6.8,72.4C-22.4,71.1,-37.4,63.8,-49.8,53.2C-62.2,42.6,-72,28.7,-74.6,13.4C-77.2,-1.9,-72.6,-18.6,-63.9,-31.8C-55.2,-45,-42.4,-54.7,-28.9,-63.4C-15.4,-72,-1.2,-79.6,13.6,-77.3C28.4,-75,41.2,-62.8,45,-62.5Z" transform="translate(100 100)" />
                            </svg>
                        </div>
                        <div className="relative z-10 max-w-lg">
                            <h2 className="text-xl sm:text-2xl font-bold leading-snug">
                                Siap Menyelesaikan Tugas?
                            </h2>
                            <p className="text-gray-300 text-xs sm:text-sm mt-2 leading-relaxed">
                                Pastikan selalu mengunggah bukti foto saat menyelesaikan pekerjaan agar laporan dapat diverifikasi dengan baik.
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">TUGAS AKTIF</p>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-3xl font-extrabold text-blue-600">{assignedCount}</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">TUGAS SELESAI</p>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-3xl font-extrabold text-emerald-600">{resolvedCount}</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Table Tugas Terbaru */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 flex items-center justify-between border-b border-gray-50">
                            <h3 className="font-bold text-gray-900 text-base">Tugas Terkini</h3>
                            <Link href="/team/reports" className="text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors">
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/70 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        <th className="py-3 px-6">LAPORAN</th>
                                        <th className="py-3 px-6">STATUS</th>
                                        <th className="py-3 px-6 text-right">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-xs">
                                    {recentReports.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="py-8 text-center text-gray-400">
                                                Belum ada tugas saat ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentReports.map((report) => (
                                            <tr key={report.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <p className="font-bold text-gray-900">#RP-{report.id} - {report.title}</p>
                                                    <p className="text-[11px] text-gray-500 mt-0.5">Oleh: {report.user.name}</p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold capitalize ${
                                                        report.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' :
                                                        report.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-gray-50 text-gray-600'
                                                    }`}>
                                                        {report.status === 'in_progress' ? 'Proses' :
                                                         report.status === 'resolved' ? 'Selesai' : report.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    {report.status === 'in_progress' && (
                                                        <button
                                                            onClick={() => openResolveModal(report)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors"
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Selesaikan
                                                        </button>
                                                    )}
                                                    {report.status !== 'in_progress' && (
                                                        <Link href={`/reports/${report.id}`} className="text-gray-500 hover:text-gray-900 font-medium text-xs">
                                                            Detail
                                                        </Link>
                                                    )}
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
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                <LayoutDashboard className="w-5 h-5 text-gray-700" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-base">Info Prosedur</h3>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Setiap penyelesaian tugas mewajibkan bukti foto dan catatan singkat hasil perbaikan.
                        </p>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden h-40 shadow-sm border border-gray-100 group">
                        <img
                            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
                            alt="Perbaikan Fasilitas"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-5">
                            <p className="text-white text-xs font-semibold leading-snug italic">
                                "Kerja cerdas dan berkualitas demi kenyamanan bersama."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resolve Modal */}
            {resolvingReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-lg font-bold text-gray-900">Selesaikan Tugas</h3>
                                <button onClick={closeResolveModal} className="text-gray-400 hover:text-gray-700 transition">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 mb-6">
                                Laporkan hasil pekerjaan untuk <strong>#RP-{resolvingReport.id}</strong>
                            </p>

                            <form onSubmit={submitResolve} className="space-y-4">
                                <div>
                                    <label htmlFor="evidence" className="block text-sm font-medium text-gray-700">Bukti Foto Pekerjaan</label>
                                    <div className="mt-1 flex items-center justify-center w-full">
                                        <label htmlFor="evidence" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${errors.resolution_evidence ? 'border-red-300' : 'border-gray-300'}`}>
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {data.resolution_evidence ? (
                                                    <div className="flex flex-col items-center">
                                                        <ImagePlus className="w-8 h-8 text-emerald-500 mb-2" />
                                                        <p className="text-sm font-semibold text-gray-700">{data.resolution_evidence.name}</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                                        <p className="text-xs text-gray-500 font-medium">Klik untuk upload foto (.jpg, .png)</p>
                                                    </>
                                                )}
                                            </div>
                                            <input 
                                                id="evidence" 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={e => setData('resolution_evidence', e.target.files ? e.target.files[0] : null)} 
                                            />
                                        </label>
                                    </div>
                                    {errors.resolution_evidence && <p className="mt-2 text-sm text-red-600">{errors.resolution_evidence}</p>}
                                </div>

                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Catatan Penyelesaian</label>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        placeholder="Jelaskan apa saja yang telah diperbaiki..."
                                        value={data.resolution_notes}
                                        onChange={e => setData('resolution_notes', e.target.value)}
                                        required
                                    ></textarea>
                                    {errors.resolution_notes && <p className="mt-2 text-sm text-red-600">{errors.resolution_notes}</p>}
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3">
                                    <button 
                                        type="button" 
                                        onClick={closeResolveModal} 
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing || !data.resolution_evidence || !data.resolution_notes}
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-25"
                                    >
                                        Kirim Laporan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

TeamDashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
