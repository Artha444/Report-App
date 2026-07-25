import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="flex min-h-screen">
            {/* Left — hero panel */}
            <div className="hidden w-1/2 bg-[#0F172A] lg:flex lg:flex-col lg:items-center lg:justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0F172A]" />
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5" />
                <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/5" />
                <div className="relative z-10 text-center px-12">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                        <LogIn className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-white">
                        Report App
                    </h1>
                    <p className="mt-4 text-lg text-slate-300">
                        Sistem pelaporan dan pengaduan sekolah yang terintegrasi
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-8 text-slate-400">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">3</p>
                            <p className="text-xs">Role</p>
                        </div>
                        <div className="h-8 w-px bg-slate-600" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">Realtime</p>
                            <p className="text-xs">Notifikasi</p>
                        </div>
                        <div className="h-8 w-px bg-slate-600" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">24/7</p>
                            <p className="text-xs">Akses</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right — form */}
            <div className="flex w-full items-center justify-center bg-slate-50 px-6 lg:w-1/2">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="mb-8 text-center lg:hidden">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0F172A]">
                            <LogIn className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#0F172A]">
                            Report App
                        </h1>
                    </div>

                    <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
                        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#0F172A]">
                            Sign in
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Masuk ke akun kamu untuk melanjutkan
                        </p>

                        <form onSubmit={submit} className="mt-6 space-y-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <div className="relative mt-1.5">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="block w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20"
                                        autoComplete="email"
                                        placeholder="email@sekolah.sch.id"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <div className="relative mt-1.5">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="block w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-11 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20"
                                        autoComplete="current-password"
                                        placeholder="Masukkan password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember */}
                            <div className="flex items-center gap-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-[#0F172A] focus:ring-[#0F172A]/30"
                                />
                                <label htmlFor="remember" className="text-sm text-slate-600">
                                    Ingat saya
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#1E293B] active:scale-[0.98] disabled:opacity-50"
                            >
                                <LogIn className="h-4 w-4" />
                                {processing ? 'Masuk...' : 'Sign in'}
                            </button>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Belum punya akun?{' '}
                        <Link
                            href="/register"
                            className="font-semibold text-[#0F172A] underline-offset-2 hover:underline"
                        >
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
