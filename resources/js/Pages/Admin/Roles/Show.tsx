import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

interface Permission {
    id: number;
    name: string;
    slug: string;
    description: string;
}

interface RoleUser {
    id: number;
    name: string;
    email: string;
}

interface RoleData {
    id: number;
    name: string;
    slug: string;
    description: string;
    permissions: Permission[];
    users: RoleUser[];
}

interface ShowProps {
    role: RoleData;
}

export default function Show({ role }: ShowProps) {
    return (
        <AdminLayout header={`Role: ${role.name}`}>
            <Head title={role.name} />

            <div className="max-w-2xl space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900">{role.name}</h2>
                        <p className="text-sm text-gray-400 font-mono mt-1">{role.slug}</p>
                    </div>
                    {role.description && (
                        <p className="text-sm text-gray-600">{role.description}</p>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Permissions ({role.permissions.length})
                    </h3>
                    {role.permissions.length > 0 ? (
                        <div className="space-y-2">
                            {role.permissions.map((perm) => (
                                <div key={perm.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{perm.name}</p>
                                        <p className="text-xs text-gray-500">{perm.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No permissions assigned</p>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Users ({role.users.length})
                    </h3>
                    {role.users.length > 0 ? (
                        <div className="space-y-2">
                            {role.users.map((user) => (
                                <Link
                                    key={user.id}
                                    href={`/admin/users/${user.id}`}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                                >
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No users with this role</p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href={`/admin/roles/${role.id}/edit`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                    >
                        Edit Role
                    </Link>
                    <Link href="/admin/roles" className="text-sm text-gray-500 hover:text-gray-700">
                        ← Back to Roles
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
