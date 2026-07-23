import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Estate, Payment, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Show({
    estate,
    payment,
}: PageProps<{ estate: Estate; payment: Payment & { tenant: any; estate: any } }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Payment Receipt
                </h2>
            }
        >
            <Head title="Payment Receipt" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('estates.payments.index', estate.id)}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            &larr; Back to payments
                        </Link>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            <div className="text-center border-b pb-6 mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">{estate.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{estate.address}</p>
                                <p className="text-xs text-gray-400 mt-1">EstatePay Payment Receipt</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-gray-500">Receipt No</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        EP-{payment.id.toString().padStart(6, '0')}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-gray-500">Tenant</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {payment.tenant?.name}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-gray-500">Apartment</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {payment.tenant?.apartment_number}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-gray-500">Period</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {payment.period}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-gray-500">Amount</span>
                                    <span className="text-lg font-bold text-green-600">
                                        ₦{payment.amount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <span
                                        className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                            payment.status === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {payment.status.toUpperCase()}
                                    </span>
                                </div>
                                {payment.payment_method && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-sm text-gray-500">Payment Method</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {payment.payment_method.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                {payment.transaction_reference && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-sm text-gray-500">Reference</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {payment.transaction_reference}
                                        </span>
                                    </div>
                                )}
                                {payment.paid_at && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-sm text-gray-500">Paid On</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {new Date(payment.paid_at).toLocaleDateString('en-NG', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                )}
                                {payment.notes && (
                                    <div className="py-2 border-b">
                                        <span className="text-sm text-gray-500">Notes</span>
                                        <p className="text-sm text-gray-900 mt-1">{payment.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 text-center text-xs text-gray-400 border-t pt-4">
                                This receipt was generated by EstatePay. For disputes, contact your estate chairman.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
