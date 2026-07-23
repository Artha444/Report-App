import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ReopenDialog({ reportId }: { reportId: number }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing } = useForm({ user_feedback: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/reports/${reportId}/reopen`, {
            onSuccess: () => setOpen(false),
        });
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className="px-4 py-2 bg-purple-600 text-white text-sm rounded">
                Reopen Report
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Reopen Report</h3>
                        <form onSubmit={submit}>
                            <label className="block text-sm font-medium mb-1">Why are you reopening this report?</label>
                            <textarea
                                className="w-full border rounded p-2 text-sm"
                                rows={4}
                                placeholder="Explain why the resolution is unsatisfactory..."
                                value={data.user_feedback}
                                onChange={(e) => setData('user_feedback', e.target.value)}
                                required
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm border rounded">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm bg-purple-600 text-white rounded">
                                    Reopen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
