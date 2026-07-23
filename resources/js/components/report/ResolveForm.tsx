import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ResolveForm({ reportId }: { reportId: number }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing } = useForm({
        resolution_evidence: null as File | null,
        resolution_notes: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/team/reports/${reportId}/resolve`, {
            forceFormData: true,
            onSuccess: () => setOpen(false),
        });
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className="text-green-600 text-sm">Resolve</button>

            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Resolve Report</h3>
                        <form onSubmit={submit} encType="multipart/form-data">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Resolution Evidence (photo)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full border rounded p-2 text-sm"
                                        onChange={(e) => setData('resolution_evidence', e.target.files?.[0] ?? null)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Resolution Notes</label>
                                    <textarea
                                        className="w-full border rounded p-2 text-sm"
                                        rows={4}
                                        placeholder="Describe how the issue was resolved..."
                                        value={data.resolution_notes}
                                        onChange={(e) => setData('resolution_notes', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm border rounded">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm bg-green-600 text-white rounded">
                                    Resolve
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
