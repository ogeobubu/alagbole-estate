import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Estate, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ estate }: PageProps<{ estate: Estate }>) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        email: '',
        apartment_number: '',
        rent_amount: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('estates.tenants.store', estate.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Add Tenant — {estate.name}
                </h2>
            }
        >
            <Head title="Add Tenant" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('estates.show', estate.id)}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            &larr; Back to {estate.name}
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

                                <div className="flex items-center justify-end gap-3 border-t pt-6">
                                    <Link
                                        href={route('estates.show', estate.id)}
                                        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        Add Tenant
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
