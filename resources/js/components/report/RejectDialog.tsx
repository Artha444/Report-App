import { useForm } from '@inertiajs/react';
import { useState } from 'react';

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
            <button onClick={() => setOpen(true)} className="text-red-600 text-sm">Reject</button>

            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Reject Report</h3>
                        <form onSubmit={submit}>
                            <textarea
                                className="w-full border rounded p-2 text-sm"
                                rows={4}
                                placeholder="Provide a reason for rejection..."
                                value={data.rejection_reason}
                                onChange={(e) => setData('rejection_reason', e.target.value)}
                                required
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm border rounded">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm bg-red-600 text-white rounded">
                                    Reject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
