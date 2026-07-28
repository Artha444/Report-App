import AppLayout from '@/components/AppLayout';
import { useForm, usePage, router } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';
import {
    Users,
    PlusCircle,
    UserPlus,
    X,
    FileText,
    Settings,
    Edit2,
    Trash2,
    Briefcase,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';

type Member = { id: number; name: string };
type Team = {
    id: number;
    name: string;
    description: string | null;
    members: Member[];
};
type Staff = {
    id: number;
    name: string;
    role: string;
};

export default function AdminTeams() {
    const { teams, staffMembers } = usePage().props as { teams: Team[]; staffMembers: Staff[] };
    const { data, setData, post, put, delete: destroy, processing } = useForm({ name: '', description: '' });
    const [editing, setEditing] = useState<number | null>(null);
    const [addMember, setAddMember] = useState<number | null>(null);
    const [memberUserId, setMemberUserId] = useState('');

    function createTeam(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/teams', {
            onSuccess: () => {
                setData('name', '');
                setData('description', '');
            }
        });
    }

    function updateTeam(e: React.FormEvent, id: number) {
        e.preventDefault();
        put(`/admin/teams/${id}`, { onSuccess: () => setEditing(null) });
    }

    function addMemberToTeam(teamId: number) {
        router.post(`/admin/teams/${teamId}/members`, { user_id: memberUserId }, {
            onSuccess: () => {
                setAddMember(null);
                setMemberUserId('');
            }
        });
    }

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
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Kelola Tim</h1>
                        <p className="text-slate-400 text-sm mt-0.5">Atur divisi dan penugasan anggota tim penyelesai laporan</p>
                    </div>
                </div>
            </div>

            {/* Split Screen Grid (Form on Left/Top, List on Right/Bottom) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Form: New Team */}
                <div className="lg:col-span-1 space-y-4">
                    <form onSubmit={createTeam} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
                            <PlusCircle className="w-5 h-5 text-gray-800" />
                            <h2 className="font-bold text-gray-900 text-sm sm:text-base">Buat Tim Baru</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-700">Nama Tim / Divisi</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Sarpras, Kurikulum"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-gray-400 transition-all font-medium placeholder:text-gray-300"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-700">Deskripsi Tugas</label>
                                <textarea
                                    placeholder="Tulis tanggung jawab tim ini..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-gray-400 transition-all font-medium placeholder:text-gray-300 resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white py-3 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>{processing ? 'Membuat...' : 'Buat Tim'}</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Team Card Lists */}
                <div className="lg:col-span-2 space-y-4">
                    {teams.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-400">
                                <Users className="w-6 h-6" />
                            </div>
                            <p className="font-bold text-gray-900 text-sm">Belum ada tim terdaftar</p>
                            <p className="text-xs text-gray-400 mt-1">Gunakan form di samping untuk membuat tim pertama.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {teams.map((team) => (
                                <div key={team.id} className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4 hover:shadow-md transition-all">
                                    {editing === team.id ? (
                                        /* Edit Form Card */
                                        <form onSubmit={(e) => updateTeam(e, team.id)} className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-gray-700">Nama Tim</label>
                                                <input
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className="w-full border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:border-gray-400 transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-gray-700">Deskripsi</label>
                                                <textarea
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    rows={3}
                                                    className="w-full border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:border-gray-400 transition-all resize-none"
                                                />
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditing(null)}
                                                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.98] shadow-sm"
                                                >
                                                    Simpan Perubahan
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        /* Display Team Detail */
                                        <>
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-gray-100">
                                                            <Briefcase className="w-4 h-4 text-[#0F172A]" />
                                                        </div>
                                                        <h3 className="font-extrabold text-gray-900 text-base">{team.name}</h3>
                                                    </div>
                                                    {team.description && (
                                                        <p className="text-xs text-gray-500 font-medium leading-relaxed pl-10">
                                                            {team.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button
                                                        onClick={() => {
                                                            setEditing(team.id);
                                                            setData('name', team.name);
                                                            setData('description', team.description || '');
                                                        }}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
                                                        title="Edit Tim"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Apakah Anda yakin ingin menghapus tim ini?')) {
                                                                router.delete(`/admin/teams/${team.id}`);
                                                            }
                                                        }}
                                                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Hapus Tim"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Members Area */}
                                            <div className="pt-4 border-t border-gray-50 pl-10 space-y-3">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Anggota Tim ({team.members.length})</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {team.members.map((m) => (
                                                        <span
                                                            key={m.id}
                                                            className="inline-flex items-center gap-1 bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 transition-all cursor-pointer group"
                                                            title="Keluarkan dari tim"
                                                            onClick={() => {
                                                                if (confirm(`Keluarkan ${m.name} dari tim ${team.name}?`)) {
                                                                    router.delete(`/admin/teams/${team.id}/members/${m.id}`);
                                                                }
                                                            }}
                                                        >
                                                            {m.name}
                                                            <X className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 ml-0.5 shrink-0" />
                                                        </span>
                                                    ))}
                                                </div>

                                                {addMember === team.id ? (
                                                    /* Add Member Row */
                                                    <div className="flex gap-2 mt-2 flex-wrap items-center">
                                                        <select
                                                            value={memberUserId}
                                                            onChange={(e) => setMemberUserId(e.target.value)}
                                                            className="border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:border-gray-400 bg-white shadow-sm w-full sm:w-56"
                                                        >
                                                            <option value="" disabled>Pilih Staf / Guru</option>
                                                            {staffMembers.map(staff => (
                                                                <option key={staff.id} value={staff.id}>{staff.name} ({staff.role})</option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() => addMemberToTeam(team.id)}
                                                            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
                                                            disabled={!memberUserId}
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Tambah
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setAddMember(null);
                                                                setMemberUserId('');
                                                            }}
                                                            className="px-3 py-2 rounded-xl text-xs font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                ) : (
                                                    /* Trigger Add Member Button */
                                                    <button
                                                        onClick={() => setAddMember(team.id)}
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F172A] hover:text-[#1E293B] hover:underline pt-1 transition-all"
                                                    >
                                                        <UserPlus className="w-3.5 h-3.5" />
                                                        <span>Tambah Anggota</span>
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

AdminTeams.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
