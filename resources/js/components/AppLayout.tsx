import { Link, usePage } from '@inertiajs/react';
import type { Auth } from '@/types/auth';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
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
} from 'lucide-react';

type NavItem = {
    href: string;
    label: string;
    icon: React.ElementType;
};

export default function AppLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage().props as { auth: Auth };
    const { url } = usePage();

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

    function SidebarLink({ item }: { item: NavItem }) {
        const active = isActive(item.href);
        return (
            <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                        ? 'bg-white text-[#0F172A]'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
            >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
            </Link>
        );
    }

    function SectionHeader({ label }: { label: string }) {
        return (
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-6 first:mt-0">
                {label}
            </p>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-[#0F172A] flex flex-col fixed h-screen">
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
                    {mainNav.map((item) => (
                        <SidebarLink key={item.href} item={item} />
                    ))}

                    {teamNav.length > 0 && (
                        <>
                            <SectionHeader label="Tim" />
                            {teamNav.map((item) => (
                                <SidebarLink key={item.href} item={item} />
                            ))}
                        </>
                    )}

                    {adminNav.length > 0 && (
                        <>
                            <SectionHeader label="Admin" />
                            {adminNav.map((item) => (
                                <SidebarLink key={item.href} item={item} />
                            ))}
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
            </aside>

            <main className="flex-1 ml-64 p-6">
                <div className="flex justify-end items-center mb-6">
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
