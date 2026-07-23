import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Permission {
    id: number;
    name: string;
    slug: string;
    description: string;
}

interface RoleData {
    id: number;
    name: string;
    slug: string;
    description: string;
    permission_ids?: number[];
}

interface EditProps {
    role: RoleData;
    permissions: Permission[];
}

export default function Edit({ role, permissions }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        slug: role.slug,
        description: role.description || '',
        permissions: role.permission_ids || [] as number[],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/roles/${role.id}`);
    };

    const togglePermission = (permId: number) => {
        setData('permissions', data.permissions.includes(permId)
            ? data.permissions.filter(id => id !== permId)
            : [...data.permissions, permId]
        );
    };

    return (
        <AdminLayout header={`Edit Role: ${role.name}`}>
            <Head title={`Edit ${role.name}`} />

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                        <input
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
                        />
                        {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                        <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                            {permissions.map((perm) => (
                                <label key={perm.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={data.permissions.includes(perm.id)}
                                        onChange={() => togglePermission(perm.id)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{perm.name}</p>
                                        <p className="text-xs text-gray-500">{perm.description}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t">
                        <Link href="/admin/roles" className="text-sm text-gray-500 hover:text-gray-700">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
