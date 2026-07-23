import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Estate, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Index({ estates }: PageProps<{ estates: (Estate & { tenants_count: number })[] }>) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Estates
                    </h2>
                    <Link
                        href={route('estates.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        + New Estate
                    </Link>
                </div>
            }
        >
            <Head title="Estates" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {estates.length === 0 ? (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    No estates yet
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    Create your first estate to start managing tenants and payments.
                                </p>
                                <Link
                                    href={route('estates.create')}
                                    className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Create Estate
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {estates.map((estate) => (
                                <Link
                                    key={estate.id}
                                    href={route('estates.show', estate.id)}
                                    className="block overflow-hidden bg-white shadow-sm sm:rounded-lg transition hover:shadow-md"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {estate.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">{estate.address}</p>
                                            </div>
                                            <div className="text-right">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                                        estate.subscription_status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : estate.subscription_status === 'trial'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {estate.subscription_status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium text-gray-900">
                                                    {estate.tenants_count}
                                                </span>{' '}
                                                tenants
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900">
                                                    ₦{estate.monthly_dues_amount.toLocaleString()}
                                                </span>{' '}
                                                /month
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900">
                                                    {estate.units_count}
                                                </span>{' '}
                                                units
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
