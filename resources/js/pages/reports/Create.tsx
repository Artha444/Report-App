import AppLayout from '@/components/AppLayout';
import { useForm } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';

export default function CreateReport() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        location: '',
        priority: 'medium',
        images: [] as File[],
    });

    const [previews, setPreviews] = useState<string[]>([]);

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []).slice(0, 5);
        setData('images', files);
        setPreviews(files.map((f) => URL.createObjectURL(f)));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/reports', {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Submit a Report</h1>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full border rounded p-2"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="w-full border rounded p-2"
                        rows={4}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Location</label>
                    <input
                        type="text"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                        className="w-full border rounded p-2"
                    />
                    {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Priority</label>
                    <select
                        value={data.priority}
                        onChange={(e) => setData('priority', e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Images (max 5)</label>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full" />
                    {previews.length > 0 && (
                        <div className="flex gap-2 mt-2">
                            {previews.map((src, i) => (
                                <img key={i} src={src} className="w-20 h-20 object-cover rounded" alt="" />
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
                >
                    {processing ? 'Submitting...' : 'Submit Report'}
                </button>
            </form>
        </div>
    );
}

CreateReport.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
