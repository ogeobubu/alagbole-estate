import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

interface Role {
    id: number;
    name: string;
}

interface Estate {
    name: string;
    address: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
    roles: Role[];
    estate?: Estate;
}

interface ShowProps {
    user: UserData;
}

export default function Show({ user }: ShowProps) {
    return (
        <AdminLayout header={`User: ${user.name}`}>
            <Head title={user.name} />

            <div className="max-w-2xl space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    </div>

                    <dl className="grid grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Admin</dt>
                            <dd className="mt-1">
                                {user.is_admin ? (
                                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Yes</span>
                                ) : (
                                    <span className="text-sm text-gray-500">No</span>
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Created</dt>
                            <dd className="mt-1 text-sm text-gray-900">{new Date(user.created_at).toLocaleDateString()}</dd>
                        </div>
                    </dl>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Roles</h3>
                    {user.roles.length > 0 ? (
                        <div className="flex gap-2 flex-wrap">
                            {user.roles.map((role) => (
                                <span key={role.id} className="px-3 py-1.5 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full">
                                    {role.name}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No roles assigned</p>
                    )}
                </div>

                {user.estate && (
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estate</h3>
                        <p className="text-sm text-gray-900">{user.estate.name}</p>
                        <p className="text-sm text-gray-500">{user.estate.address}</p>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                    >
                        Edit User
                    </Link>
                    <Link href="/admin/users" className="text-sm text-gray-500 hover:text-gray-700">
                        ← Back to Users
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
