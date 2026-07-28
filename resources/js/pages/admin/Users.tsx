import AppLayout from '@/components/AppLayout';
import { useForm, usePage, Link } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';
import {
    Users,
    Search,
    Calendar,
    ChevronDown,
    Mail,
    Shield,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
};

type PaginatedUsers = {
    data: User[];
    links: { url: string | null; label: string; active: boolean }[];
};

export default function AdminUsers() {
    const { users } = usePage().props as { users: PaginatedUsers };
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.data.filter((user) => {
        return (
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1a2d4a] to-[#0F172A] p-6 sm:p-8">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                        <Users className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Kelola Pengguna</h1>
                        <p className="text-slate-400 text-sm mt-0.5">Atur peran dan hak akses pengguna EduResolve</p>
                    </div>
                </div>
            </div>

            {/* Top Bar: Search Input */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari pengguna berdasarkan nama atau email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 placeholder-gray-400 shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* User Cards / List */}
            {filteredUsers.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-400">
                        <Users className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-gray-900 text-sm">Tidak ada pengguna ditemukan</p>
                    <p className="text-xs text-gray-400 mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/70 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="py-4 px-6">Pengguna</th>
                                    <th className="py-4 px-6">Email</th>
                                    <th className="py-4 px-6">Hak Akses / Peran</th>
                                    <th className="py-4 px-6">Terdaftar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-xs">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/40 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#0F172A] border border-gray-100 shrink-0">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <RoleSelector user={user} />
                                        </td>
                                        <td className="py-4 px-6 text-gray-500 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                {formatDate(user.created_at)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card List View */}
                    <div className="md:hidden divide-y divide-gray-50">
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="p-5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#0F172A] border border-gray-100 shrink-0">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{user.name}</h3>
                                        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                            <Mail className="w-3 h-3" />
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-1">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Peran</span>
                                        <RoleSelector user={user} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Terdaftar</span>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold h-9 pl-1">
                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                            {formatDate(user.created_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pagination Footer */}
            {users.links && users.links.length > 3 && (
                <div className="flex items-center justify-center gap-1 pt-4">
                    {users.links.map((link, idx) => {
                        const isPrevious = link.label.includes('Previous') || link.label.includes('&laquo;');
                        const isNext = link.label.includes('Next') || link.label.includes('&raquo;');

                        if (!link.url) {
                            return (
                                <span
                                    key={idx}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-xs text-gray-300 font-medium"
                                >
                                    {isPrevious ? <ChevronLeft className="w-4 h-4" /> : isNext ? <ChevronRight className="w-4 h-4" /> : link.label}
                                </span>
                            );
                        }

                        return (
                            <Link
                                key={idx}
                                href={link.url}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                    link.active
                                        ? 'bg-black text-white'
                                        : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50 shadow-sm'
                                }`}
                            >
                                {isPrevious ? (
                                    <ChevronLeft className="w-4 h-4" />
                                ) : isNext ? (
                                    <ChevronRight className="w-4 h-4" />
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function RoleSelector({ user }: { user: User }) {
    const { patch } = useForm();
    const [open, setOpen] = useState(false);

    function changeRole(role: string) {
        patch(`/admin/users/${user.id}/role`, {
            data: { role },
            preserveScroll: true,
            onSuccess: () => setOpen(false)
        });
    }

    const roleColors = {
        admin: 'bg-[#0F172A]/10 text-[#0F172A] border-[#0F172A]/20',
        teacher: 'bg-orange-50 text-orange-600 border-orange-200/50',
        student: 'bg-blue-50 text-blue-600 border-blue-200/50',
    } as Record<string, string>;

    const currentRoleLabel =
        user.role === 'admin' ? 'Admin' :
        user.role === 'teacher' ? 'Guru' : 'Siswa';

    return (
        <div className="relative inline-block text-left w-full md:w-36">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
                    roleColors[user.role] ?? roleColors.student
                } hover:opacity-90 active:scale-[0.98] shadow-sm`}
            >
                <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 opacity-70" />
                    <span>{currentRoleLabel}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute z-50 mt-1.5 w-full md:w-36 bg-white border border-gray-100 rounded-xl shadow-lg p-1 space-y-0.5 animate-in fade-in-50 slide-in-from-top-1 duration-100">
                        <button
                            type="button"
                            onClick={() => changeRole('student')}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                            Siswa
                        </button>
                        <button
                            type="button"
                            onClick={() => changeRole('teacher')}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                            Guru
                        </button>
                        <button
                            type="button"
                            onClick={() => changeRole('admin')}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-[#0F172A]/10 hover:text-[#0F172A] transition-colors"
                        >
                            Admin
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

AdminUsers.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
