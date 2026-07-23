import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

interface Role {
    id: number;
    name: string;
    slug: string;
    description: string;
    users_count: number;
    permissions_count: number;
}

interface IndexProps {
    roles: Role[];
}

export default function Index({ roles }: IndexProps) {
    const handleDelete = (roleId: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(`/admin/roles/${roleId}`);
        }
    };

    return (
        <AdminLayout header="Manage Roles">
            <Head title="Manage Roles" />

            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">
                    Define roles and assign permissions to control access across the platform.
                </p>
                <Link
                    href="/admin/roles/create"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                    + Add Role
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                    <div key={role.id} className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                                <p className="text-xs text-gray-400 font-mono mt-1">{role.slug}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/admin/roles/${role.id}/edit`}
                                    className="px-2 py-1 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(role.id)}
                                    className="px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        {role.description && (
                            <p className="text-sm text-gray-500 mb-4">{role.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{role.users_count} users</span>
                            <span>{role.permissions_count} permissions</span>
                        </div>
                        <Link
                            href={`/admin/roles/${role.id}`}
                            className="mt-4 block text-center text-sm text-indigo-600 hover:text-indigo-700"
                        >
                            View Details →
                        </Link>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
