import AppLayout from '@/components/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import type React from 'react';
import { useState, useEffect } from 'react';
import {
    Send,
    MapPin,
    AlertCircle,
    X,
    FileText,
    UploadCloud,
    ShieldCheck,
    Clock,
    CheckCircle2,
    ChevronDown
} from 'lucide-react';

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
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Buat Laporan Baru
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Sampaikan keluhan atau masukan Anda dengan jujur dan transparan untuk sekolah yang lebih baik.
                </p>
            </div>

            {/* Main Form Container */}
            <form onSubmit={submit} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header Card */}
                <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-gray-800" />
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Formulir Laporan</h2>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                    {/* Judul Laporan */}
                    <div id="field-title" className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700">
                            Judul Laporan
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Contoh: Kerusakan Fasilitas Lab Komputer"
                            className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm focus:outline-none transition-all placeholder:text-gray-300 ${
                                errors.title ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-gray-400'
                            }`}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    {/* Deskripsi Laporan */}
                    <div id="field-description" className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700">
                            Deskripsi Laporan
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Jelaskan detail kejadian atau keluhan Anda secara lengkap..."
                            rows={5}
                            className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm focus:outline-none transition-all placeholder:text-gray-300 resize-none ${
                                errors.description ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-gray-400'
                            }`}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Lokasi & Prioritas Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Lokasi Kejadian */}
                        <div id="field-location" className="space-y-2">
                            <label className="block text-xs font-bold text-gray-700">
                                Lokasi Kejadian
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-700">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="Gedung B, Lantai 2"
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs sm:text-sm focus:outline-none transition-all placeholder:text-gray-300 ${
                                        errors.location ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-gray-400'
                                    }`}
                                />
                            </div>
                            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                        </div>

                        {/* Status Prioritas */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-700">
                                Status Prioritas
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-700">
                                    <AlertCircle className="w-4 h-4" />
                                </div>
                                <select
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-gray-400 appearance-none bg-white font-medium text-gray-800"
                                >
                                    <option value="" disabled>Pilih Prioritas</option>
                                    <option value="low">Rendah</option>
                                    <option value="medium">Sedang</option>
                                    <option value="high">Tinggi</option>
                                    <option value="critical">Kritis</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upload Foto Pendukung */}
                    <div id="field-images" className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700">
                            Upload Foto Pendukung
                        </label>

                        {/* Image Previews */}
                        {previews.length > 0 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative shrink-0 group">
                                        <img src={src} className="w-20 h-20 object-cover rounded-xl border border-gray-200" alt="" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow-sm hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Dropzone */}
                        {data.images.length < 5 && (
                            <label className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-gray-400 hover:bg-gray-50/50 transition-all text-center">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3 text-gray-600">
                                    <UploadCloud className="w-5 h-5" />
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-gray-800">
                                    Klik untuk unggah atau seret foto ke sini
                                </span>
                                <span className="text-[11px] text-gray-400 mt-1">
                                    PNG, JPG up to 10MB
                                </span>
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

                    {/* Form Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
                        <Link
                            href="/reports"
                            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-all text-center"
                        >
                            Batalkan
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <span>{processing ? 'Sending...' : 'Kirim Laporan'}</span>
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

CreateReport.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
