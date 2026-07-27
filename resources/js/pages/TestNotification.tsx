import AppLayout from '@/components/AppLayout';
import { requestNotificationPermission } from '@/lib/firebase';
import { useForm, usePage } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';
import { Bell, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function TestNotification() {
    const { post, processing, errors, flash } = useForm();
    const { auth } = usePage().props as { auth: { user: { name: string; email: string } } };
    const [tokenStatus, setTokenStatus] = useState<'idle' | 'enabling' | 'done' | 'error'>('idle');
    const [hasToken, setHasToken] = useState(false);

    async function enableNotifications() {
        setTokenStatus('enabling');
        try {
            const token = await requestNotificationPermission();

            if (!token) {
                setTokenStatus('error');
                return;
            }

            const res = await fetch('/device-tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                },
                body: JSON.stringify({ token }),
            });

            if (res.ok) {
                setTokenStatus('done');
                setHasToken(true);
            } else {
                setTokenStatus('error');
            }
        } catch (err) {
            console.error('[Enable] Error:', err);
            setTokenStatus('error');
        }
    }

    function handleSend() {
        post('/test-notification');
    }

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1a2d4a] to-[#0F172A] p-6 sm:p-8">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                        <Bell className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Test Notifikasi</h1>
                        <p className="text-slate-400 text-sm mt-0.5">Kirim push notification test</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-100 space-y-4">
                <div className="text-sm text-gray-600">
                    <p>Login sebagai: <span className="font-semibold text-gray-900">{auth.user.name}</span> ({auth.user.email})</p>
                </div>

                {/* Step 1: Enable */}
                <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                    <p className="text-sm font-medium text-gray-900">Langkah 1: Aktifkan Notifikasi</p>
                    <p className="text-xs text-gray-500">Klik tombol ini untuk mengizinkan push notification dari browser.</p>
                    <button
                        onClick={enableNotifications}
                        disabled={tokenStatus === 'enabling' || tokenStatus === 'done'}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 ${
                            tokenStatus === 'done'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-[#0F172A] text-white hover:bg-[#1E293B]'
                        }`}
                    >
                        <Bell className="w-4 h-4" />
                        {tokenStatus === 'enabling' && 'Mengaktifkan...'}
                        {tokenStatus === 'idle' && 'Aktifkan Notifikasi'}
                        {tokenStatus === 'done' && '✓ Notifikasi Aktif'}
                        {tokenStatus === 'error' && 'Gagal — Coba Lagi'}
                    </button>
                </div>

                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        {flash.success}
                    </div>
                )}

                {errors?.error && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {errors.error}
                    </div>
                )}

                {/* Step 2: Send */}
                <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                    <p className="text-sm font-medium text-gray-900">Langkah 2: Kirim Test</p>
                    <p className="text-xs text-gray-500">Setelah notifikasi aktif, klik tombol ini untuk mengirim test push notification.</p>
                    <button
                        onClick={handleSend}
                        disabled={processing || !hasToken}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98] disabled:opacity-40"
                    >
                        <Send className="w-4 h-4" />
                        {processing ? 'Mengirim...' : 'Kirim Test Notifikasi'}
                    </button>
                </div>
            </div>
        </div>
    );
}

TestNotification.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
