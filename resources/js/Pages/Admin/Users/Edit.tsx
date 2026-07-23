import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Role {
    id: number;
    name: string;
    slug: string;
    description: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    role_ids?: number[];
}

interface EditProps {
    user: UserData;
    roles: Role[];
}

export default function Edit({ user, roles }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        is_admin: user.is_admin,
        roles: user.role_ids || [] as number[],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    const toggleRole = (roleId: number) => {
        setData('roles', data.roles.includes(roleId)
            ? data.roles.filter(id => id !== roleId)
            : [...data.roles, roleId]
        );
    };

    return (
        <AdminLayout header={`Edit User: ${user.name}`}>
            <Head title={`Edit ${user.name}`} />

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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={data.is_admin}
                            onChange={(e) => setData('is_admin', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">Admin access</label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                        <div className="space-y-2">
                            {roles.map((role) => (
                                <label key={role.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={data.roles.includes(role.id)}
                                        onChange={() => toggleRole(role.id)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{role.name}</p>
                                        <p className="text-xs text-gray-500">{role.description}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t">
                        <Link href="/admin/users" className="text-sm text-gray-500 hover:text-gray-700">
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
