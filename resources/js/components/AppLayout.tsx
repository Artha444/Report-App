import { Link, usePage } from '@inertiajs/react';
import type { Auth } from '@/types/auth';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { requestNotificationPermission } from '@/lib/firebase';

export default function AppLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage().props as { auth: Auth };

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

    const navLinks = [];
    navLinks.push({ href: '/dashboard', label: 'Dashboard' });

    if (auth.user.role === 'student' || auth.user.role === 'teacher') {
        navLinks.push({ href: '/reports/create', label: 'Submit Report' });
        navLinks.push({ href: '/reports', label: 'My Reports' });
    }

    if (auth.user.role === 'teacher') {
        navLinks.push({ href: '/team/dashboard', label: 'Team Dashboard' });
        navLinks.push({ href: '/team/reports', label: 'Team Reports' });
    }

    if (auth.user.role === 'admin') {
        navLinks.push({ href: '/admin/reports', label: 'All Reports' });
        navLinks.push({ href: '/admin/teams', label: 'Manage Teams' });
        navLinks.push({ href: '/admin/users', label: 'Manage Users' });
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-white border-r">
                <div className="p-4 font-bold text-lg border-b">School Reports</div>
                <nav className="p-2 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block px-3 py-2 rounded hover:bg-gray-100"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div />
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{auth.user.name} ({auth.user.role})</span>
                        <Link href="/logout" method="post" as="button" className="text-sm text-red-600">
                            Logout
                        </Link>
                    </div>
                </div>
                {children}
            </main>
        </div>
    );
}
