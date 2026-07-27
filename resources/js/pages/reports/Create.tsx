import AppLayout from '@/components/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import type React from 'react';
import { useState, useEffect, useRef } from 'react';
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

const priorities = [
    { value: 'low', label: 'Rendah', desc: 'Tidak mendesak', color: 'text-gray-500', bg: 'bg-gray-100', dot: 'bg-gray-400', ring: 'ring-gray-200', hoverBg: 'hover:bg-gray-50' },
    { value: 'medium', label: 'Sedang', desc: 'Perlu perhatian', color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-500', ring: 'ring-blue-200', hoverBg: 'hover:bg-blue-50' },
    { value: 'high', label: 'Tinggi', desc: 'Segera ditangani', color: 'text-orange-600', bg: 'bg-orange-100', dot: 'bg-orange-500', ring: 'ring-orange-200', hoverBg: 'hover:bg-orange-50' },
    { value: 'critical', label: 'Kritis', desc: 'Darurat', color: 'text-red-600', bg: 'bg-red-100', dot: 'bg-red-500', ring: 'ring-red-200', hoverBg: 'hover:bg-red-50' },
] as const;

export default function CreateReport() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        location: '',
        priority: 'medium',
        images: [] as File[],
    });

    const [previews, setPreviews] = useState<string[]>([]);
    const isSubmitting = useRef(false);

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
        if (isSubmitting.current || processing) return;
        isSubmitting.current = true;
        post('/reports', {
            forceFormData: true,
            onFinish: () => { isSubmitting.current = false; },
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
                            <PriorityDropdown
                                value={data.priority}
                                onChange={(val) => setData('priority', val)}
                            />
                        </div>
                    </div>

                    {/* Upload Foto Pendukung */}
                    <div id="field-images" className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700">
                            Upload Foto Pendukung
                        </label>

                        {data.images.length === 0 ? (
                            /* Empty state: full-width dropzone */
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
                        ) : (
                            /* Has images: inline row with preview cards + add button */
                            <div className="flex gap-3 overflow-x-auto pt-2 pr-2 pb-2">
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
                                {data.images.length < 5 && (
                                    <label className="shrink-0 w-20 h-20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-gray-400 hover:bg-gray-50/50 transition-all text-center">
                                        <UploadCloud className="w-4 h-4 text-gray-400 mb-1" />
                                        <span className="text-[10px] font-medium text-gray-400">Tambah</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
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

function PriorityDropdown({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = priorities.find((p) => p.value === value) ?? priorities[1];

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        function handleEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`w-full flex items-center gap-3 pl-10 pr-4 py-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${
                    open ? 'border-gray-400 ring-2 ring-black/5' : 'border-gray-200 hover:border-gray-300'
                }`}
            >
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <AlertCircle className="w-4 h-4 text-gray-700" />
                </div>
                <span className={`w-2 h-2 rounded-full ${selected.dot} shrink-0`} />
                <span className="text-gray-800 flex-1">{selected.label}</span>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                className={`absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-200 origin-top ${
                    open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                }`}
            >
                <div className="p-1.5">
                    {priorities.map((p) => {
                        const active = p.value === value;
                        return (
                            <button
                                key={p.value}
                                type="button"
                                onClick={() => {
                                    onChange(p.value);
                                    setOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                                    active
                                        ? `${p.bg} ${p.color}`
                                        : `text-gray-700 ${p.hoverBg}`
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${active ? p.dot : 'bg-gray-300'} shrink-0`} />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-semibold ${active ? '' : 'text-gray-800'}`}>{p.label}</p>
                                    <p className={`text-[11px] ${active ? 'opacity-80' : 'text-gray-400'}`}>{p.desc}</p>
                                </div>
                                {active && (
                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 opacity-60" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

CreateReport.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
