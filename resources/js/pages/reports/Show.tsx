import AppLayout from '@/components/AppLayout';
import StatusBadge from '@/components/report/StatusBadge';
import type { Report } from '@/types/reports';
import { Head, Link, usePage } from '@inertiajs/react';
import type React from 'react';
import type { Auth } from '@/types/auth';
import { useState } from 'react';
import {
    ArrowLeft,
    MapPin,
    Clock,
    User,
    Users,
    FileText,
    AlertTriangle,
    Camera,
    CheckCircle,
    XCircle,
    MessageSquare,
    Send,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

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

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

export default function ReportShow({ report }: { report: Report }) {
    const { auth } = usePage().props as { auth: Auth };
    const backUrl = auth.user.role === 'admin' ? '/admin/reports'
        : auth.user.role === 'teacher' ? '/team/reports'
        : '/reports';
    const backLabel = auth.user.role === 'admin' ? 'All Reports'
        : auth.user.role === 'teacher' ? 'Team Reports'
        : 'Riwayat';
    const canReopen = report.status === 'resolved' && report.user.id === auth.user.id;
    const [reopenOpen, setReopenOpen] = useState(false);
    const [reopenFeedback, setReopenFeedback] = useState('');
    const [showLogs, setShowLogs] = useState(false);

    const borderColor =
        report.status === 'resolved' ? 'border-l-green-500' :
        report.status === 'in_progress' ? 'border-l-orange-500' :
        report.status === 'pending' ? 'border-l-yellow-500' :
        report.status === 'rejected' ? 'border-l-red-500' :
        'border-l-blue-500';

    return (
        <div className="max-w-2xl mx-auto space-y-5">
            <Head title={report.title} />

            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1a2d4a] to-[#0F172A] p-6 sm:p-8">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="relative z-10">
                    <Link
                        href={backUrl}
                        className="inline-flex items-center gap-1 text-slate-400 text-sm hover:text-white transition-colors mb-3"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {backLabel}
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">{report.title}</h1>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <StatusBadge status={report.status} />
                        <span className="text-xs text-slate-400">{timeAgo(report.created_at)}</span>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className={`bg-white rounded-2xl p-5 border-l-4 ${borderColor} space-y-4`}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-400 font-medium">Deskripsi</p>
                        <p className="text-sm text-gray-900">{report.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-400 font-medium">Lokasi</p>
                        <p className="text-sm text-gray-900">{report.location}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-400 font-medium">Prioritas</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                            report.priority === 'critical' ? 'bg-red-50 text-red-600' :
                            report.priority === 'high' ? 'bg-orange-50 text-orange-600' :
                            report.priority === 'medium' ? 'bg-blue-50 text-blue-600' :
                            'bg-gray-50 text-gray-500'
                        }`}>
                            {report.priority}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-400 font-medium">Dilaporkan oleh</p>
                        <p className="text-sm text-gray-900">{report.user.name}</p>
                    </div>
                </div>

                {report.team && (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-medium">Ditugaskan ke</p>
                            <p className="text-sm text-gray-900">{report.team.name}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-400 font-medium">Waktu</p>
                        <p className="text-sm text-gray-900">{formatDate(report.created_at)}</p>
                        {report.confirmed_at && (
                            <p className="text-xs text-gray-400 mt-0.5">Dikonfirmasi: {formatDate(report.confirmed_at)}</p>
                        )}
                        {report.resolved_at && (
                            <p className="text-xs text-gray-400 mt-0.5">Selesai: {formatDate(report.resolved_at)}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Rejection */}
            {report.rejection_reason && (
                <div className="bg-red-50 rounded-2xl p-5 border-l-4 border-l-red-500">
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <p className="text-sm font-semibold text-red-800">Ditolak</p>
                    </div>
                    <p className="text-sm text-red-700">{report.rejection_reason}</p>
                </div>
            )}

            {/* Resolution */}
            {report.resolution_notes && (
                <div className="bg-green-50 rounded-2xl p-5 border-l-4 border-l-green-500">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <p className="text-sm font-semibold text-green-800">Selesai</p>
                    </div>
                    <p className="text-sm text-green-700">{report.resolution_notes}</p>
                </div>
            )}

            {/* Resolution Evidence */}
            {report.resolution_evidence && (
                <div className="bg-white rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Camera className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-semibold text-gray-900">Bukti Penyelesaian</p>
                    </div>
                    <img
                        src={`/storage/${report.resolution_evidence}`}
                        alt="Evidence"
                        className="w-full max-w-xs rounded-xl object-cover"
                    />
                </div>
            )}

            {/* User Feedback */}
            {report.user_feedback && (
                <div className="bg-purple-50 rounded-2xl p-5 border-l-4 border-l-purple-500">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-purple-500" />
                        <p className="text-sm font-semibold text-purple-800">Feedback (Reopen)</p>
                    </div>
                    <p className="text-sm text-purple-700">{report.user_feedback}</p>
                </div>
            )}

            {/* Images */}
            {report.images.length > 0 && (
                <div className="bg-white rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Camera className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-semibold text-gray-900">Foto Lampiran</p>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {report.images.map((img) => (
                            <img key={img.id} src={img.url} className="w-24 h-24 object-cover rounded-xl shrink-0" alt="" />
                        ))}
                    </div>
                </div>
            )}

            {/* Activity Log */}
            {report.logs.length > 0 && (
                <div className="bg-white rounded-2xl p-5">
                    <button
                        onClick={() => setShowLogs(!showLogs)}
                        className="flex items-center justify-between w-full"
                    >
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <p className="text-sm font-semibold text-gray-900">Aktivitas</p>
                            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-lg">{report.logs.length}</span>
                        </div>
                        {showLogs ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>

                    {showLogs && (
                        <div className="mt-4 space-y-3">
                            {report.logs.map((log, i) => (
                                <div key={log.id} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2.5 h-2.5 bg-[#0F172A] rounded-full mt-1.5 shrink-0" />
                                        {i < report.logs.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                                    </div>
                                    <div className="pb-4">
                                        <p className="text-sm text-gray-900">
                                            <span className="font-semibold">{log.user.name}</span>
                                            {' '}{log.action.replace(/_/g, ' ')}
                                        </p>
                                        {log.description && <p className="text-xs text-gray-500 mt-0.5">{log.description}</p>}
                                        <p className="text-[11px] text-gray-400 mt-1">{timeAgo(log.created_at)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Reopen */}
            {canReopen && (
                <button
                    onClick={() => setReopenOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-purple-700 transition-all active:scale-[0.98]"
                >
                    <Send className="w-4 h-4" />
                    Buka Kembali Laporan
                </button>
            )}

            {/* Reopen Modal */}
            {reopenOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Buka Kembali Laporan</h3>
                        <p className="text-sm text-gray-500 mb-4">Jelaskan mengapa penyelesaian belum memuaskan</p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            fetch(`/reports/${report.id}/reopen`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                                    'X-Inertia': 'true',
                                },
                                body: JSON.stringify({ user_feedback: reopenFeedback }),
                            }).then(() => {
                                setReopenOpen(false);
                                window.location.reload();
                            });
                        }}>
                            <textarea
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all resize-none placeholder:text-gray-400"
                                rows={4}
                                placeholder="Tulis alasan kamu..."
                                value={reopenFeedback}
                                onChange={(e) => setReopenFeedback(e.target.value)}
                                required
                            />
                            <div className="flex gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setReopenOpen(false)}
                                    className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
                                >
                                    Kirim
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

ReportShow.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
