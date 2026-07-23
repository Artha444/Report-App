import AppLayout from '@/components/AppLayout';
import { useForm, usePage } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';

export default function AdminTeams() {
    const { teams } = usePage().props as { teams: { id: number; name: string; description: string | null; members: { id: number; name: string }[] }[] };
    const { data, setData, post, put, delete: destroy, processing } = useForm({ name: '', description: '' });
    const [editing, setEditing] = useState<number | null>(null);
    const [addMember, setAddMember] = useState<number | null>(null);
    const [memberUserId, setMemberUserId] = useState('');

    function createTeam(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/teams', { onSuccess: () => { setData('name', ''); setData('description', ''); } });
    }

    function updateTeam(e: React.FormEvent, id: number) {
        e.preventDefault();
        put(`/admin/teams/${id}`, { onSuccess: () => setEditing(null) });
    }

    function addMemberToTeam(teamId: number) {
        post(`/admin/teams/${teamId}/members`, { data: { user_id: memberUserId }, onSuccess: () => { setAddMember(null); setMemberUserId(''); } });
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Manage Teams</h1>

            <form onSubmit={createTeam} className="bg-white rounded shadow p-4 mb-6 space-y-3">
                <h2 className="font-semibold">New Team</h2>
                <input placeholder="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full border rounded p-2" required />
                <textarea placeholder="Description (optional)" value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full border rounded p-2" />
                <button type="submit" disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
            </form>

            <div className="space-y-4">
                {teams.map((team) => (
                    <div key={team.id} className="bg-white rounded shadow p-4">
                        {editing === team.id ? (
                            <form onSubmit={(e) => updateTeam(e, team.id)} className="space-y-2">
                                <input value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full border rounded p-2" required />
                                <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full border rounded p-2" />
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Save</button>
                                    <button type="button" onClick={() => setEditing(null)} className="text-gray-600 text-sm">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold">{team.name}</h3>
                                        {team.description && <p className="text-sm text-gray-500">{team.description}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditing(team.id); setData('name', team.name); setData('description', team.description || ''); }}
                                            className="text-blue-600 text-sm">Edit</button>
                                        <button onClick={() => destroy(`/admin/teams/${team.id}`)} className="text-red-600 text-sm">Delete</button>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p className="text-sm font-medium">Members:</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {team.members.map((m) => (
                                            <span key={m.id} className="bg-gray-100 px-2 py-0.5 rounded text-sm flex items-center gap-1">
                                                {m.name}
                                                <button onClick={() => destroy(`/admin/teams/${team.id}/members/${m.id}`)} className="text-red-500 text-xs ml-1">×</button>
                                            </span>
                                        ))}
                                    </div>
                                    {addMember === team.id ? (
                                        <div className="flex gap-2 mt-2">
                                            <input value={memberUserId} onChange={(e) => setMemberUserId(e.target.value)}
                                                placeholder="User ID" type="number" className="border rounded p-1 text-sm w-24" />
                                            <button onClick={() => addMemberToTeam(team.id)} className="bg-green-600 text-white px-2 py-1 rounded text-sm">Add</button>
                                            <button onClick={() => setAddMember(null)} className="text-gray-600 text-sm">Cancel</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setAddMember(team.id)} className="text-blue-600 text-sm mt-2">+ Add Member</button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

AdminTeams.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
