import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Estate, Tenant, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({
    estate,
    tenant,
}: PageProps<{ estate: Estate; tenant: Tenant }>) {
    const { data, setData, put, processing, errors } = useForm({
        name: tenant.name,
        phone: tenant.phone,
        email: tenant.email ?? '',
        apartment_number: tenant.apartment_number,
        rent_amount: tenant.rent_amount.toString(),
        status: tenant.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('estates.tenants.update', [estate.id, tenant.id]));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Tenant — {tenant.name}
                </h2>
            }
        >
            <Head title="Edit Tenant" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('estates.tenants.show', [estate.id, tenant.id])}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            &larr; Back to {tenant.name}
                        </Link>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="name" value="Full Name" />
                                        <TextInput
                                            id="name"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="apartment_number" value="Apartment Number" />
                                        <TextInput
                                            id="apartment_number"
                                            className="mt-1 block w-full"
                                            value={data.apartment_number}
                                            onChange={(e) => setData('apartment_number', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.apartment_number} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="phone" value="Phone Number" />
                                        <TextInput
                                            id="phone"
                                            className="mt-1 block w-full"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.phone} />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="email" value="Email (optional)" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="rent_amount" value="Monthly Rent (₦)" />
                                        <TextInput
                                            id="rent_amount"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.rent_amount}
                                            onChange={(e) => setData('rent_amount', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.rent_amount} />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="status" value="Status" />
                                        <select
                                            id="status"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value as any)}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="moved_out">Moved Out</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.status} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 border-t pt-6">
                                    <Link
                                        href={route('estates.tenants.show', [estate.id, tenant.id])}
                                        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        Update Tenant
                                    </PrimaryButton>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
