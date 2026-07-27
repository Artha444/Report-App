import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { XCircle } from 'lucide-react';

export default function RejectDialog({ reportId }: { reportId: number }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing } = useForm({ rejection_reason: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/admin/reports/${reportId}/reject`, {
            onSuccess: () => setOpen(false),
        });
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 active:scale-95"
            >
                <XCircle className="w-3 h-3" />
                Reject
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900">Reject Report</h3>
                        <p className="text-sm text-gray-500 mt-1">Berikan alasan penolakan laporan ini.</p>
                        <form onSubmit={submit} className="mt-4">
                            <textarea
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
                                rows={4}
                                placeholder="Alasan penolakan..."
                                value={data.rejection_reason}
                                onChange={(e) => setData('rejection_reason', e.target.value)}
                                required
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-xl transition hover:bg-red-700 active:scale-95 disabled:opacity-50"
                                >
                                    <XCircle className="w-4 h-4" />
                                    {processing ? 'Menolak...' : 'Reject'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
