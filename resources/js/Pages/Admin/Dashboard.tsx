import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

interface DashboardStats {
    total_users: number;
    total_estates: number;
    total_tenants: number;
    total_payments: number;
    total_revenue: number;
    active_estates: number;
    trial_estates: number;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    roles: string[];
}

interface RecentPayment {
    id: number;
    tenant_name: string;
    estate_name: string;
    period: string;
    amount: number;
    status: string;
}

interface DashboardProps {
    stats: DashboardStats;
    recent_users: RecentUser[];
    recent_payments: RecentPayment[];
}

export default function Dashboard({ stats, recent_users, recent_payments }: DashboardProps) {
    const statCards = [
        { label: 'Total Users', value: stats.total_users, color: 'bg-indigo-500' },
        { label: 'Total Estates', value: stats.total_estates, color: 'bg-emerald-500' },
        { label: 'Total Tenants', value: stats.total_tenants, color: 'bg-amber-500' },
        { label: 'Paid Payments', value: stats.total_payments, color: 'bg-cyan-500' },
        { label: 'Total Revenue', value: `₦${Number(stats.total_revenue).toLocaleString()}`, color: 'bg-rose-500' },
        { label: 'Active Subscriptions', value: stats.active_estates, color: 'bg-violet-500' },
        { label: 'Trial Estates', value: stats.trial_estates, color: 'bg-orange-500' },
    ];

    return (
        <AdminLayout header="Admin Dashboard">
            <Head title="Admin Dashboard" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-6">
                        <div className={`h-2 w-12 rounded ${stat.color} mb-3`} />
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="bg-white rounded-xl shadow-sm border">
                    <div className="px-6 py-4 border-b flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
                        <Link href="/admin/users" className="text-sm text-indigo-600 hover:text-indigo-700">
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y">
                        {recent_users.map((user) => (
                            <div key={user.id} className="px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {user.is_admin && (
                                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Admin</span>
                                    )}
                                    {user.roles.map((role) => (
                                        <span key={role} className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-white rounded-xl shadow-sm border">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
                    </div>
                    <div className="divide-y">
                        {recent_payments.map((payment) => (
                            <div key={payment.id} className="px-6 py-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {payment.tenant_name} → {payment.estate_name}
                                    </p>
                                    <p className="text-xs text-gray-500">{payment.period}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                        ₦{Number(payment.amount).toLocaleString()}
                                    </p>
                                    <span className={`text-xs font-medium ${
                                        payment.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                                    }`}>
                                        {payment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
