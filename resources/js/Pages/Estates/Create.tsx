import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        units_count: '',
        monthly_dues_amount: '',
        chairman_name: '',
        chairman_phone: '',
        chairman_email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('estates.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Estate
                </h2>
            }
        >
            <Head title="Create Estate" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Estate Name" />
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
                                    <InputLabel htmlFor="address" value="Address" />
                                    <TextInput
                                        id="address"
                                        className="mt-1 block w-full"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.address} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="units_count" value="Total Units" />
                                        <TextInput
                                            id="units_count"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.units_count}
                                            onChange={(e) => setData('units_count', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.units_count} />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="monthly_dues_amount" value="Monthly Dues (₦)" />
                                        <TextInput
                                            id="monthly_dues_amount"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.monthly_dues_amount}
                                            onChange={(e) => setData('monthly_dues_amount', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.monthly_dues_amount} />
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Chairman Details</h4>

                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="chairman_name" value="Chairman Name" />
                                            <TextInput
                                                id="chairman_name"
                                                className="mt-1 block w-full"
                                                value={data.chairman_name}
                                                onChange={(e) => setData('chairman_name', e.target.value)}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.chairman_name} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="chairman_phone" value="Chairman Phone" />
                                                <TextInput
                                                    id="chairman_phone"
                                                    className="mt-1 block w-full"
                                                    value={data.chairman_phone}
                                                    onChange={(e) => setData('chairman_phone', e.target.value)}
                                                    required
                                                />
                                                <InputError className="mt-2" message={errors.chairman_phone} />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="chairman_email" value="Chairman Email (optional)" />
                                                <TextInput
                                                    id="chairman_email"
                                                    type="email"
                                                    className="mt-1 block w-full"
                                                    value={data.chairman_email}
                                                    onChange={(e) => setData('chairman_email', e.target.value)}
                                                />
                                                <InputError className="mt-2" message={errors.chairman_email} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 border-t pt-6">
                                    <Link
                                        href={route('estates.index')}
                                        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        Create Estate
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
