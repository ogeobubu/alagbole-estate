import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Estate, Payment, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Stats {
    total_tenants: number;
    paid_count: number;
    pending_count: number;
    total_collected: number;
    expected_total: number;
}

export default function Dashboard({
    estate,
    stats,
    recentPayments,
}: PageProps<{ estate: Estate | null; stats: Stats | null; recentPayments: Payment[] }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {!estate ? (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Welcome to EstatePay
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    You haven't set up an estate yet. Create one to get started.
                                </p>
                                <Link
                                    href={route('estates.create')}
                                    className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Create Estate
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{estate.name}</h3>
                                <p className="text-sm text-gray-500">{estate.address}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                <StatCard
                                    title="Total Tenants"
                                    value={stats?.total_tenants ?? 0}
                                    color="blue"
                                />
                                <StatCard
                                    title="Paid This Month"
                                    value={stats?.paid_count ?? 0}
                                    color="green"
                                />
                                <StatCard
                                    title="Pending"
                                    value={stats?.pending_count ?? 0}
                                    color="yellow"
                                />
                                <StatCard
                                    title="Collected"
                                    value={`₦${(stats?.total_collected ?? 0).toLocaleString()}`}
                                    color="indigo"
                                />
                            </div>

                            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
                                <Link
                                    href={route('estates.show', estate.id)}
                                    className="block rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-950/5 transition hover:shadow-md"
                                >
                                    <div className="text-sm font-medium text-gray-500">Manage Estate</div>
                                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                                        {estate.name}
                                    </div>
                                    <div className="mt-2 text-sm text-indigo-600">
                                        View details &rarr;
                                    </div>
                                </Link>
                                <Link
                                    href={route('estates.tenants.index', estate.id)}
                                    className="block rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-950/5 transition hover:shadow-md"
                                >
                                    <div className="text-sm font-medium text-gray-500">Tenants</div>
                                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                                        {stats?.total_tenants ?? 0}
                                    </div>
                                    <div className="mt-2 text-sm text-indigo-600">
                                        Manage tenants &rarr;
                                    </div>
                                </Link>
                                <Link
                                    href={route('estates.payments.index', estate.id)}
                                    className="block rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-950/5 transition hover:shadow-md"
                                >
                                    <div className="text-sm font-medium text-gray-500">Payments</div>
                                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                                        ₦{(stats?.total_collected ?? 0).toLocaleString()}
                                    </div>
                                    <div className="mt-2 text-sm text-indigo-600">
                                        View all payments &rarr;
                                    </div>
                                </Link>
                            </div>

                            {recentPayments.length > 0 && (
                                <div className="mt-8 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Recent Payments
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Tenant
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Amount
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Period
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {recentPayments.map((payment) => (
                                                    <tr key={payment.id}>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                            {payment.tenant?.name ?? '—'}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                            ₦{payment.amount.toLocaleString()}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                            {payment.period}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <StatusBadge status={payment.status} />
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                            {payment.paid_at
                                                                ? new Date(payment.paid_at).toLocaleDateString()
                                                                : '—'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({
    title,
    value,
    color,
}: {
    title: string;
    value: string | number;
    color: 'blue' | 'green' | 'yellow' | 'indigo';
}) {
    const colors = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        yellow: 'text-yellow-600',
        indigo: 'text-indigo-600',
    };

    return (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
                <div className="text-sm font-medium text-gray-500">{title}</div>
                <div className={`mt-1 text-2xl font-semibold ${colors[color]}`}>
                    {value}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        paid: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        overdue: 'bg-red-100 text-red-800',
        refunded: 'bg-gray-100 text-gray-800',
    };

    return (
        <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${styles[status] ?? styles.pending}`}
        >
            {status}
        </span>
    );
}
