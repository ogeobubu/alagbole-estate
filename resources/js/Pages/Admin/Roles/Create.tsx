import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Permission {
    id: number;
    name: string;
    slug: string;
    description: string;
}

interface CreateProps {
    permissions: Permission[];
}

export default function Create({ permissions }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        permissions: [] as number[],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/roles');
    };

    const togglePermission = (permId: number) => {
        setData('permissions', data.permissions.includes(permId)
            ? data.permissions.filter(id => id !== permId)
            : [...data.permissions, permId]
        );
    };

    const autoSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    return (
        <AdminLayout header="Create Role">
            <Head title="Create Role" />

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => {
                                setData('name', e.target.value);
                                if (!data.slug || data.slug === autoSlug(data.name)) {
                                    setData('slug', autoSlug(e.target.value));
                                }
                            }}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="e.g. Property Manager"
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
                            placeholder="e.g. property-manager"
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
                            placeholder="What can users with this role do?"
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
                            {processing ? 'Creating...' : 'Create Role'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
