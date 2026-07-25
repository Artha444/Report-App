import AppLayout from '@/components/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import type React from 'react';
import { useState, useEffect } from 'react';
import {
    Send,
    MapPin,
    AlertTriangle,
    Camera,
    X,
    FileText,
} from 'lucide-react';

const priorities = [
    { value: 'low', label: 'Rendah', color: 'border-gray-300 bg-gray-50', activeColor: 'border-gray-500 bg-gray-100', dot: 'bg-gray-400' },
    { value: 'medium', label: 'Sedang', color: 'border-blue-200 bg-blue-50', activeColor: 'border-blue-500 bg-blue-100', dot: 'bg-blue-500' },
    { value: 'high', label: 'Tinggi', color: 'border-orange-200 bg-orange-50', activeColor: 'border-orange-500 bg-orange-100', dot: 'bg-orange-500' },
    { value: 'critical', label: 'Kritis', color: 'border-red-200 bg-red-50', activeColor: 'border-red-500 bg-red-100', dot: 'bg-red-500' },
];

export default function CreateReport() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        location: '',
        priority: 'medium',
        images: [] as File[],
    });

    const [previews, setPreviews] = useState<string[]>([]);

    const fieldOrder = ['title', 'description', 'location', 'images'] as const;

    useEffect(() => {
        for (const field of fieldOrder) {
            if (errors[field]) {
                const timer = setTimeout(() => {
                    document.getElementById(`field-${field}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
                return () => clearTimeout(timer);
            }
        }
    }, [errors]);

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const newFiles = Array.from(e.target.files || []);
        const combined = [...data.images, ...newFiles].slice(0, 5);
        setData('images', combined);
        setPreviews(combined.map((f) => URL.createObjectURL(f)));
    }

    function removeImage(index: number) {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setData('images', newImages);
        setPreviews(newPreviews);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/reports', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreviews([]);
            },
        });
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1a2d4a] to-[#0F172A] p-6 sm:p-8">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="relative z-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Buat Laporan</h1>
                    <p className="text-slate-400 text-sm mt-1">Sampaikan keluhan atau masalah yang kamu temui</p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-5">
                {/* Title */}
                <div id="field-title" className="bg-white rounded-2xl p-5">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Judul Laporan
                    </label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Contoh: Kerusakan kipas angin di kelas 7A"
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                            errors.title ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-[#0F172A]/20 focus:border-[#0F172A]'
                        }`}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                {/* Description */}
                <div id="field-description" className="bg-white rounded-2xl p-5">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <AlertTriangle className="w-4 h-4 text-gray-400" />
                        Deskripsi
                    </label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Jelaskan masalah secara detail..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 resize-none ${
                            errors.description ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-[#0F172A]/20 focus:border-[#0F172A]'
                        }`}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Location */}
                <div id="field-location" className="bg-white rounded-2xl p-5">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        Lokasi
                    </label>
                    <input
                        type="text"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                        placeholder="Contoh: Gedung A, Lantai 2, Ruang 7A"
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                            errors.location ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-[#0F172A]/20 focus:border-[#0F172A]'
                        }`}
                    />
                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>

                {/* Priority */}
                <div className="bg-white rounded-2xl p-5">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <AlertTriangle className="w-4 h-4 text-gray-400" />
                        Prioritas
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {priorities.map((p) => (
                            <button
                                key={p.value}
                                type="button"
                                onClick={() => setData('priority', p.value)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                                    data.priority === p.value ? p.activeColor : p.color
                                }`}
                            >
                                <span className={`w-2.5 h-2.5 rounded-full ${p.dot}`} />
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div id="field-images" className={`bg-white rounded-2xl p-5 ${errors.images ? 'ring-2 ring-red-400' : ''}`}>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Camera className="w-4 h-4 text-gray-400" />
                        Foto (maks. 5)
                    </label>

                    {previews.length > 0 && (
                        <div className="-m-1 p-1 overflow-x-auto pb-2">
                            <div className="flex gap-2">
                            {previews.map((src, i) => (
                                <div key={i} className="relative shrink-0 pt-2 pr-2">
                                    <img src={src} className="w-20 h-20 object-cover rounded-xl" alt="" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md z-10"
                                    >
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            ))}
                            </div>
                        </div>
                    )}

                    {data.images.length < 5 && (
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#0F172A]/40 hover:bg-slate-50 transition-all">
                        <Camera className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">Klik untuk upload foto</span>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                    )}
                    {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 bg-[#0F172A] text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-[#1a2540] transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    <Send className="w-4 h-4" />
                    {processing ? 'Mengirim...' : 'Kirim Laporan'}
                </button>
            </form>
        </div>
    );
}

CreateReport.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
