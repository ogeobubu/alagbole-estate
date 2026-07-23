import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
    slug: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
    roles: Role[];
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
}

interface IndexProps {
    users: PaginatedUsers;
    roles: Role[];
}

export default function Index({ users, roles }: IndexProps) {
    const [search, setSearch] = useState('');

    const filteredUsers = users.data.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (userId: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/admin/users/${userId}`);
        }
    };

    return (
        <AdminLayout header="Manage Users">
            <Head title="Manage Users" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    />
                </div>
                <Link
                    href="/admin/users/create"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                    + Add User
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1 flex-wrap">
                                        {user.roles.map((role) => (
                                            <span key={role.id} className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                                                {role.name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.is_admin ? (
                                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Yes</span>
                                    ) : (
                                        <span className="text-xs text-gray-400">No</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/users/${user.id}`}
                                            className="text-sm text-indigo-600 hover:text-indigo-700"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={`/admin/users/${user.id}/edit`}
                                            className="text-sm text-amber-600 hover:text-amber-700"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-sm text-red-600 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.last_page > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {Array.from({ length: users.last_page }, (_, i) => (
                        <Link
                            key={i + 1}
                            href={`/admin/users?page=${i + 1}`}
                            className={`px-3 py-2 text-sm rounded-lg ${
                                users.current_page === i + 1
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white border text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {i + 1}
                        </Link>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
