import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Estate, Payment, Tenant, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({
    estate,
    tenant,
}: PageProps<{ estate: Estate; tenant: Tenant & { payments: Payment[] } }>) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            {tenant.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Apartment {tenant.apartment_number} — {estate.name}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('estates.payments.create', [estate.id, tenant.id])}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            Record Payment
                        </Link>
                        <button
                            onClick={() => {
                                if (confirm(`Send SMS payment reminder to ${tenant.name}?`)) {
                                    router.post(route('estates.tenants.remind', [estate.id, tenant.id]));
                                }
                            }}
                            className="rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
                        >
                            Send Reminder
                        </button>
                        <Link
                            href={route('estates.tenants.edit', [estate.id, tenant.id])}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Edit
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={tenant.name} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('estates.tenants.index', estate.id)}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            &larr; Back to tenants
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm font-medium text-gray-500">Phone</div>
                            <div className="mt-1 text-lg font-semibold text-gray-900">{tenant.phone}</div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm font-medium text-gray-500">Monthly Rent</div>
                            <div className="mt-1 text-lg font-semibold text-gray-900">
                                ₦{tenant.rent_amount.toLocaleString()}
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm font-medium text-gray-500">Status</div>
                            <div className="mt-1">
                                <span
                                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                        tenant.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {tenant.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Period
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Method
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Paid At
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Reference
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {tenant.payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                                                No payment records yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        tenant.payments.map((payment) => (
                                            <tr key={payment.id}>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                    {payment.period}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                    ₦{payment.amount.toLocaleString()}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                                            payment.status === 'paid'
                                                                ? 'bg-green-100 text-green-800'
                                                                : payment.status === 'pending'
                                                                  ? 'bg-yellow-100 text-yellow-800'
                                                                  : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {payment.payment_method ?? '—'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {payment.paid_at
                                                        ? new Date(payment.paid_at).toLocaleDateString()
                                                        : '—'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {payment.transaction_reference ?? '—'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
