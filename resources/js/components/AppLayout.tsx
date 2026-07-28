import { Link, usePage } from '@inertiajs/react';
import type { Auth } from '@/types/auth';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { setupForegroundListener } from '@/lib/firebase';
import {
    LayoutDashboard,
    PlusSquare,
    History,
    LogOut,
    Settings,
    Menu,
    Megaphone,
    FileText,
    Users,
    CircleUser
} from 'lucide-react';

type NavItem = {
    href: string;
    label: string;
    icon: React.ElementType;
};

export default function AppLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage().props as { auth: Auth };
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => {});
        }
        setupForegroundListener();
    }, []);

    useEffect(() => {
        setSidebarOpen(false);
    }, [url]);

    const mainNav: NavItem[] = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    // @ts-ignore
    const hasTeam = auth.teams && auth.teams.length > 0;

    if (auth.user.role === 'student' || (['teacher', 'janitor', 'technician'].includes(auth.user.role) && !hasTeam)) {
        mainNav.push(
            { href: '/reports/create', label: 'Lapor', icon: PlusSquare },
            { href: '/reports', label: 'Riwayat', icon: History },
        );
    }

    if (['teacher', 'janitor', 'technician'].includes(auth.user.role) && hasTeam) {
        mainNav.push({ href: '/team/reports', label: 'Laporan Tim', icon: History });
    }

    if (auth.user.role === 'admin') {
        mainNav.push(
            { href: '/admin/reports', label: 'Semua Laporan', icon: FileText },
            { href: '/admin/teams', label: 'Kelola Tim', icon: Users },
            { href: '/admin/users', label: 'Kelola Pengguna', icon: CircleUser },
        );
    }

    function isActive(href: string): boolean {
        if (href === '/dashboard') {
            return url === '/dashboard' || url === '/';
        }
        if (url === href) return true;
        if (!url.startsWith(href)) return false;
        const nextChar = url[href.length];
        return nextChar === undefined || nextChar === '?' || nextChar === '#';
    }

    function SidebarContent() {
        return (
            <div className="flex flex-col h-full justify-between p-6">
                <div>
                    {/* Brand / Logo Header */}
                    <div className="mb-8">
                        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">EduResolve</h1>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">Sistem Pelaporan Sekolah</p>
                    </div>

                    {/* Primary Navigation */}
                    <nav className="space-y-1.5">
                        {mainNav.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        active
                                            ? 'bg-[#182030] text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Action Button CTA */}
                    {(auth.user.role === 'student' || (['teacher', 'janitor', 'technician'].includes(auth.user.role) && !hasTeam)) && (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <Link
                                href="/reports/create"
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#182030] hover:bg-[#111827] text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95"
                            >
                                Lapor Sekarang
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="space-y-1 pt-6 border-t border-gray-100">
                    <Link
                        href="#"
                        className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        <Settings className="w-5 h-5 shrink-0" />
                        Settings
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-3.5 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        Logout
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col fixed h-screen z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col transition-transform duration-300 md:hidden ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-4 sm:p-8 max-w-[1400px]">
                {/* Mobile Topbar */}
                <div className="flex items-center justify-between mb-6 md:hidden bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{auth.user.name}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium capitalize">
                                {auth.user.role}
                            </span>
                        </div>
                    </div>
                </div>

                {children}
            </main>
        </div>
    );
}
