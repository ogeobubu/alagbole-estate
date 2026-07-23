import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Estate, Tenant, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

declare global {
    interface Window {
        PaystackPop?: {
            setup: (config: Record<string, unknown>) => { openIframe: () => void };
        };
    }
}

export default function Create({
    estate,
    tenants,
    selectedTenant,
    currentPeriod,
    paystackPublicKey,
}: PageProps<{
    estate: Estate;
    tenants: Tenant[];
    selectedTenant: Tenant | null;
    currentPeriod: string;
    paystackPublicKey: string;
}>) {
    const [payingOnline, setPayingOnline] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        tenant_id: selectedTenant?.id?.toString() ?? '',
        amount: selectedTenant?.rent_amount?.toString() ?? estate.monthly_dues_amount.toString(),
        period: currentPeriod,
        payment_method: 'bank_transfer',
        transaction_reference: '',
        notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.payment_method === 'paystack') {
            handlePaystackPayment();
        } else {
            post(route('estates.payments.store', estate.id));
        }
    };

    const handlePaystackPayment = async () => {
        if (!data.tenant_id) {
            return;
        }

        setPayingOnline(true);

        try {
            const response = await fetch(route('estates.payments.paystack', estate.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    tenant_id: data.tenant_id,
                    amount: data.amount,
                    period: data.period,
                    payment_method: 'paystack',
                }),
            });

            const result = await response.json();

            if (result.authorization_url) {
                window.location.href = result.authorization_url;
            }
        } catch {
            setPayingOnline(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Record Payment — {estate.name}
                </h2>
            }
        >
            <Head title="Record Payment" />

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
                        <form onSubmit={submit} className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="tenant_id" value="Tenant" />
                                    <select
                                        id="tenant_id"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.tenant_id}
                                        onChange={(e) => {
                                            setData('tenant_id', e.target.value);
                                            const tenant = tenants.find(
                                                (t) => t.id.toString() === e.target.value,
                                            );
                                            if (tenant) {
                                                setData('amount', tenant.rent_amount.toString());
                                            }
                                        }}
                                        required
                                    >
                                        <option value="">Select tenant</option>
                                        {tenants.map((tenant) => (
                                            <option key={tenant.id} value={tenant.id}>
                                                {tenant.apartment_number} — {tenant.name} (₦{tenant.rent_amount.toLocaleString()})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError className="mt-2" message={errors.tenant_id} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="amount" value="Amount (₦)" />
                                        <TextInput
                                            id="amount"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.amount} />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="period" value="Period (YYYY-MM)" />
                                        <TextInput
                                            id="period"
                                            className="mt-1 block w-full"
                                            value={data.period}
                                            onChange={(e) => setData('period', e.target.value)}
                                            placeholder="2026-07"
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.period} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="payment_method" value="Payment Method" />
                                        <select
                                            id="payment_method"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.payment_method}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                        >
                                            <option value="bank_transfer">Bank Transfer</option>
                                            <option value="paystack">Paystack (Online)</option>
                                            <option value="cash">Cash</option>
                                            <option value="pos">POS</option>
                                            <option value="ussd">USSD</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.payment_method} />
                                    </div>
                                    {data.payment_method !== 'paystack' && (
                                        <div>
                                            <InputLabel htmlFor="transaction_reference" value="Transaction Reference (optional)" />
                                            <TextInput
                                                id="transaction_reference"
                                                className="mt-1 block w-full"
                                                value={data.transaction_reference}
                                                onChange={(e) => setData('transaction_reference', e.target.value)}
                                            />
                                            <InputError className="mt-2" message={errors.transaction_reference} />
                                        </div>
                                    )}
                                </div>

                                {data.payment_method === 'paystack' && (
                                    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <span className="text-indigo-600 text-lg">💳</span>
                                            <div>
                                                <p className="text-sm font-medium text-indigo-900">Online Payment via Paystack</p>
                                                <p className="text-xs text-indigo-600 mt-1">
                                                    You'll be redirected to Paystack's secure checkout to complete the payment.
                                                    The payment will be automatically recorded after successful verification.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <InputLabel htmlFor="notes" value="Notes (optional)" />
                                    <textarea
                                        id="notes"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.notes} />
                                </div>

                                <div className="flex items-center justify-end gap-3 border-t pt-6">
                                    <Link
                                        href={route('estates.payments.index', estate.id)}
                                        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing || payingOnline}>
                                        {data.payment_method === 'paystack'
                                            ? (payingOnline ? 'Redirecting...' : 'Pay with Paystack')
                                            : 'Record Payment'}
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
