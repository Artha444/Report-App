import { Link, usePage } from '@inertiajs/react';
import type { Auth } from '@/types/auth';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { requestNotificationPermission } from '@/lib/firebase';
import {
    LayoutDashboard,
    PlusCircle,
    FileText,
    ClipboardList,
    Inbox,
    Users,
    UserCog,
    LogOut,
    Menu,
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
        if ('Notification' in window && 'serviceWorker' in navigator) {
            requestNotificationPermission().then((token) => {
                if (token) {
                    fetch('/device-tokens', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                        },
                        body: JSON.stringify({ token }),
                    });
                }
            });
        }
    }, []);

    useEffect(() => {
        setSidebarOpen(false);
    }, [url]);

    const mainNav: NavItem[] = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    if (auth.user.role === 'student' || auth.user.role === 'teacher') {
        mainNav.push(
            { href: '/reports/create', label: 'Buat Laporan', icon: PlusCircle },
            { href: '/reports', label: 'Riwayat', icon: FileText },
        );
    }

    const teamNav: NavItem[] = [];
    if (auth.user.role === 'teacher') {
        teamNav.push({ href: '/team/reports', label: 'Team Reports', icon: ClipboardList });
    }

    const adminNav: NavItem[] = [];
    if (auth.user.role === 'admin') {
        adminNav.push(
            { href: '/admin/reports', label: 'All Reports', icon: Inbox },
            { href: '/admin/teams', label: 'Manage Teams', icon: Users },
            { href: '/admin/users', label: 'Manage Users', icon: UserCog },
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

    function SlidingNav({ items }: { items: NavItem[] }) {
        const navRef = useRef<HTMLDivElement>(null);
        const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null);

        useEffect(() => {
            if (!navRef.current) return;
            const activeEl = navRef.current.querySelector<HTMLElement>('[data-active="true"]');
            if (activeEl) {
                const navRect = navRef.current.getBoundingClientRect();
                const activeRect = activeEl.getBoundingClientRect();
                setIndicator({
                    top: activeRect.top - navRect.top,
                    height: activeRect.height,
                });
            } else {
                setIndicator(null);
            }
        }, [url]);

        return (
            <div ref={navRef} className="relative">
                {indicator && (
                    <div
                        className="absolute left-0 right-0 bg-white rounded-lg transition-all duration-300 ease-out z-0"
                        style={{ top: indicator.top, height: indicator.height }}
                    />
                )}
                {items.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            data-active={active ? 'true' : 'false'}
                            className={`relative z-10 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                active
                                    ? 'text-[#0F172A]'
                                    : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        );
    }

    function SectionHeader({ label }: { label: string }) {
        return (
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-6 first:mt-0">
                {label}
            </p>
        );
    }

    function SidebarContent() {
        return (
            <>
                <div className="p-5 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="bg-white w-9 h-9 rounded-lg flex items-center justify-center">
                            <span className="text-[#0F172A] font-bold text-lg">E</span>
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">EduFeedback</p>
                            <p className="text-slate-400 text-xs">School Complaint System</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    <SectionHeader label="Navigasi" />
                    <SlidingNav items={mainNav} />

                    {teamNav.length > 0 && (
                        <>
                            <SectionHeader label="Tim" />
                            <SlidingNav items={teamNav} />
                        </>
                    )}

                    {adminNav.length > 0 && (
                        <>
                            <SectionHeader label="Admin" />
                            <SlidingNav items={adminNav} />
                        </>
                    )}
                </nav>

                <div className="p-3 border-t border-slate-700">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Link>
                </div>
            </>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-64 bg-[#0F172A] flex-col fixed h-screen">
                <SidebarContent />
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] flex flex-col transition-transform duration-300 md:hidden ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <SidebarContent />
            </aside>

            <main className="flex-1 md:ml-64 p-4 sm:p-6">
                {/* Mobile topbar */}
                <div className="flex items-center justify-between mb-4 md:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                auth.user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                auth.user.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                                {auth.user.role}
                            </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Desktop user info */}
                <div className="hidden md:flex justify-end items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                                auth.user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                auth.user.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                                {auth.user.role}
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-[#0F172A] flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                {children}
            </main>
        </div>
    );
}
