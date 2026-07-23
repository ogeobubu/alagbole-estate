import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Estate, Tenant, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({
    estate,
    paidCount,
    totalTenants,
}: PageProps<{ estate: Estate & { tenants: (Tenant & { current_payment: any })[] }; paidCount: number; totalTenants: number }>) {
    const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));

    const generatePayments = () => {
        if (confirm(`Generate pending payments for ${period}?`)) {
            router.post(route('estates.payments.generate', estate.id), { period });
        }
    };

    const remindAllPending = () => {
        if (confirm(`Send SMS reminders to all tenants with pending payments?`)) {
            router.post(route('estates.tenants.remindAll', estate.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            {estate.name}
                        </h2>
                        <p className="text-sm text-gray-500">{estate.address}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('estates.edit', estate.id)}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Edit
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={estate.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm font-medium text-gray-500">Active Tenants</div>
                            <div className="mt-1 text-2xl font-semibold text-blue-600">{totalTenants}</div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm font-medium text-gray-500">Paid ({new Date().toLocaleString('default', { month: 'long' })})</div>
                            <div className="mt-1 text-2xl font-semibold text-green-600">{paidCount}</div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm font-medium text-gray-500">Pending</div>
                            <div className="mt-1 text-2xl font-semibold text-yellow-600">{totalTenants - paidCount}</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Tenants</h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2">
                                <select
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const d = new Date();
                                        d.setMonth(d.getMonth() - i);
                                        return (
                                            <option key={d.toISOString()} value={d.toISOString().slice(0, 7)}>
                                                {d.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                            </option>
                                        );
                                    })}
                                </select>
                                <button
                                    onClick={generatePayments}
                                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Generate Bills
                                </button>
                                {(totalTenants - paidCount) > 0 && (
                                    <button
                                        onClick={remindAllPending}
                                        className="rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
                                    >
                                        Remind {totalTenants - paidCount} Pending
                                    </button>
                                )}
                            </div>
                            <Link
                                href={route('estates.tenants.create', estate.id)}
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            >
                                + Add Tenant
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Apt
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Rent
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {estate.tenants.map((tenant) => (
                                        <tr key={tenant.id}>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                {tenant.apartment_number}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {tenant.name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {tenant.phone}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                ₦{tenant.rent_amount.toLocaleString()}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                {tenant.current_payment ? (
                                                    <span
                                                        className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                                            tenant.current_payment.status === 'paid'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                    >
                                                        {tenant.current_payment.status}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-800">
                                                        no bill
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <Link
                                                    href={route('estates.tenants.show', [estate.id, tenant.id])}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
