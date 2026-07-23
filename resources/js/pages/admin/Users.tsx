import AppLayout from '@/components/AppLayout';
import { useForm, usePage } from '@inertiajs/react';
import type React from 'react';

export default function AdminUsers() {
    const { users } = usePage().props as {
        users: { data: { id: number; name: string; email: string; role: string; created_at: string }[] };
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-3">Name</th>
                            <th className="text-left p-3">Email</th>
                            <th className="text-left p-3">Role</th>
                            <th className="text-left p-3">Registered</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((user) => (
                            <UserRow key={user.id} user={user} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function UserRow({ user }: { user: { id: number; name: string; email: string; role: string; created_at: string } }) {
    const { patch } = useForm();

    function changeRole(e: React.ChangeEvent<HTMLSelectElement>) {
        patch(`/admin/users/${user.id}/role`, { data: { role: e.target.value }, preserveScroll: true });
    }

    return (
        <tr className="border-t">
            <td className="p-3">{user.name}</td>
            <td className="p-3">{user.email}</td>
            <td className="p-3">
                <select value={user.role} onChange={changeRole} className="border rounded p-1 text-sm">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
            </td>
            <td className="p-3 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
            <td className="p-3" />
        </tr>
    );
}

AdminUsers.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
