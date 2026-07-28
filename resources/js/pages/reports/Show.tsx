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
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function ReportShow({ report }: { report: Report }) {
    const { auth } = usePage().props as { auth: Auth };
    const backUrl =
        auth.user.role === 'admin'
            ? '/admin/reports'
            : auth.user.role === 'teacher'
              ? '/team/reports'
              : '/reports';
    const backLabel =
        auth.user.role === 'admin'
            ? 'All Reports'
            : auth.user.role === 'teacher'
              ? 'Team Reports'
              : 'Riwayat';
    const canReopen =
        report.status === 'resolved' && report.user.id === auth.user.id;
    const [reopenOpen, setReopenOpen] = useState(false);
    const [reopenFeedback, setReopenFeedback] = useState('');
    const [showLogs, setShowLogs] = useState(false);

    const borderColor =
        report.status === 'resolved'
            ? 'border-l-green-500'
            : report.status === 'in_progress'
              ? 'border-l-orange-500'
              : report.status === 'pending'
                ? 'border-l-yellow-500'
                : report.status === 'rejected'
                  ? 'border-l-red-500'
                  : 'border-l-blue-500';

    return (
        <div className="mx-auto max-w-2xl space-y-5">
            <Head title={report.title} />

            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1a2d4a] to-[#0F172A] p-6 sm:p-8">
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
                <div className="relative z-10">
                    <Link
                        href={backUrl}
                        className="mb-3 inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {backLabel}
                    </Link>
                    <h1 className="text-xl font-bold text-white sm:text-2xl">
                        {report.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusBadge status={report.status} />
                        <span className="text-xs text-slate-400">
                            {timeAgo(report.created_at)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div
                className={`rounded-2xl border-l-4 bg-white p-5 ${borderColor} space-y-4`}
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <FileText className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[11px] font-medium text-gray-400">
                            Deskripsi
                        </p>
                        <p className="text-sm text-gray-900">
                            {report.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <MapPin className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[11px] font-medium text-gray-400">
                            Lokasi
                        </p>
                        <p className="text-sm text-gray-900">
                            {report.location}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <AlertTriangle className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[11px] font-medium text-gray-400">
                            Prioritas
                        </p>
                        <span
                            className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${
                                report.priority === 'critical'
                                    ? 'bg-red-50 text-red-600'
                                    : report.priority === 'high'
                                      ? 'bg-orange-50 text-orange-600'
                                      : report.priority === 'medium'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'bg-gray-50 text-gray-500'
                            }`}
                        >
                            {report.priority}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[11px] font-medium text-gray-400">
                            Dilaporkan oleh
                        </p>
                        <p className="text-sm text-gray-900">
                            {report.user.name}
                        </p>
                    </div>
                </div>

                {report.team && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                            <Users className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-gray-400">
                                Ditugaskan ke
                            </p>
                            <p className="text-sm text-gray-900">
                                {report.team.name}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <Clock className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[11px] font-medium text-gray-400">
                            Waktu
                        </p>
                        <p className="text-sm text-gray-900">
                            {formatDate(report.created_at)}
                        </p>
                        {report.confirmed_at && (
                            <p className="mt-0.5 text-xs text-gray-400">
                                Dikonfirmasi: {formatDate(report.confirmed_at)}
                            </p>
                        )}
                        {report.resolved_at && (
                            <p className="mt-0.5 text-xs text-gray-400">
                                Selesai: {formatDate(report.resolved_at)}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Rejection */}
            {report.rejection_reason && (
                <div className="rounded-2xl border-l-4 border-l-red-500 bg-red-50 p-5">
                    <div className="mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <p className="text-sm font-semibold text-red-800">
                            Ditolak
                        </p>
                    </div>
                    <p className="text-sm text-red-700">
                        {report.rejection_reason}
                    </p>
                </div>
            )}

            {/* Resolution */}
            {report.resolution_notes && (
                <div className="rounded-2xl border-l-4 border-l-green-500 bg-green-50 p-5">
                    <div className="mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <p className="text-sm font-semibold text-green-800">
                            Selesai
                        </p>
                    </div>
                    <p className="text-sm text-green-700">
                        {report.resolution_notes}
                    </p>
                </div>
            )}

            {/* Resolution Evidence */}
            {report.resolution_evidence && (
                <div className="rounded-2xl bg-white p-5">
                    <div className="mb-3 flex items-center gap-2">
                        <Camera className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-semibold text-gray-900">
                            Bukti Penyelesaian
                        </p>
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
                <div className="rounded-2xl border-l-4 border-l-purple-500 bg-purple-50 p-5">
                    <div className="mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-purple-500" />
                        <p className="text-sm font-semibold text-purple-800">
                            Feedback (Reopen)
                        </p>
                    </div>
                    <p className="text-sm text-purple-700">
                        {report.user_feedback}
                    </p>
                </div>
            )}

            {/* Images */}
            {report.images.length > 0 && (
                <div className="rounded-2xl bg-white p-5">
                    <div className="mb-3 flex items-center gap-2">
                        <Camera className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-semibold text-gray-900">
                            Foto Lampiran
                        </p>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {report.images.map((img) => (
                            <img
                                key={img.id}
                                src={img.url}
                                className="h-24 w-24 shrink-0 rounded-xl object-cover"
                                alt=""
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Activity Log */}
            {report.logs.length > 0 && (
                <div className="rounded-2xl bg-white p-5">
                    <button
                        onClick={() => setShowLogs(!showLogs)}
                        className="flex w-full items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <p className="text-sm font-semibold text-gray-900">
                                Aktivitas
                            </p>
                            <span className="rounded-lg bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400">
                                {report.logs.length}
                            </span>
                        </div>
                        {showLogs ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                    </button>

                    {showLogs && (
                        <div className="mt-4 space-y-3">
                            {report.logs.map((log, i) => (
                                <div key={log.id} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0F172A]" />
                                        {i < report.logs.length - 1 && (
                                            <div className="mt-1 w-px flex-1 bg-gray-200" />
                                        )}
                                    </div>
                                    <div className="w-full pb-4">
                                        <p className="text-sm text-gray-900">
                                            <span className="font-semibold">
                                                {log.user.name}
                                            </span>{' '}
                                            {log.action.replace(/_/g, ' ')}
                                        </p>
                                        {log.description && (
                                            <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
                                                {log.description}
                                            </div>
                                        )}
                                        {log.action === 'resolved' &&
                                            report.resolution_evidence && (
                                                <div className="mt-3">
                                                    <img
                                                        src={`/storage/${report.resolution_evidence}`}
                                                        alt="Bukti Penyelesaian"
                                                        className="w-full max-w-sm rounded-xl border border-gray-100 object-cover shadow-sm"
                                                    />
                                                </div>
                                            )}
                                        <p className="mt-2 text-[11px] text-gray-400">
                                            {timeAgo(log.created_at)}
                                        </p>
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
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3.5 text-sm font-semibold text-white transition-all hover:bg-purple-700 active:scale-[0.98]"
                >
                    <Send className="h-4 w-4" />
                    Buka Kembali Laporan
                </button>
            )}

            {/* Reopen Modal */}
            {reopenOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6">
                        <h3 className="mb-1 text-lg font-bold text-gray-900">
                            Buka Kembali Laporan
                        </h3>
                        <p className="mb-4 text-sm text-gray-500">
                            Jelaskan mengapa penyelesaian belum memuaskan
                        </p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                fetch(`/reports/${report.id}/reopen`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-CSRF-TOKEN':
                                            document
                                                .querySelector(
                                                    'meta[name="csrf-token"]',
                                                )
                                                ?.getAttribute('content') ?? '',
                                        'X-Inertia': 'true',
                                    },
                                    body: JSON.stringify({
                                        user_feedback: reopenFeedback,
                                    }),
                                }).then(() => {
                                    setReopenOpen(false);
                                    window.location.reload();
                                });
                            }}
                        >
                            <textarea
                                className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm transition-all placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                                rows={4}
                                placeholder="Tulis alasan kamu..."
                                value={reopenFeedback}
                                onChange={(e) =>
                                    setReopenFeedback(e.target.value)
                                }
                                required
                            />
                            <div className="mt-4 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setReopenOpen(false)}
                                    className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
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
