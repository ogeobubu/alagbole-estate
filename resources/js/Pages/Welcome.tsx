import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({
    auth,
}: PageProps) {
    return (
        <>
            <Head title="EstatePay" />
            <div className="bg-gray-50 text-black/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-indigo-500 selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                                        </svg>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900">EstatePay</span>
                                </div>
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-indigo-500"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-indigo-500"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-indigo-500"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-6">
                            <div className="text-center mb-12">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    Stop chasing payments.
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                                    EstatePay automates estate dues collection. Tenants pay online, you track everything in real-time. No more WhatsApp chaos, no more Excel sheets.
                                </p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Start Free Trial
                                    </Link>
                                    <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                                        Learn more &rarr;
                                    </a>
                                </div>
                            </div>

                            <div id="features" className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                                <FeatureCard
                                    icon={
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                    }
                                    title="Real-Time Dashboard"
                                    description="See who paid and who hasn't at a glance. No more chasing tenants or guessing."
                                />
                                <FeatureCard
                                    icon={
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                    }
                                    title="Instant Payments"
                                    description="Tenants pay via bank transfer, Paystack, or POS. Receipts are auto-generated."
                                />
                                <FeatureCard
                                    icon={
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                    }
                                    title="Auto Reminders"
                                    description="Automatic SMS reminders for pending dues. Your chairman stops chasing, the system does it."
                                />
                            </div>

                            <div className="mt-16 bg-white rounded-lg shadow-sm ring-1 ring-gray-950/5 p-8">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Built for Nigerian Estates
                                    </h3>
                                    <p className="mt-2 text-gray-600">
                                        From Alagbole to Abuja, EstatePay handles Naira payments, local bank transfers, and the way Nigerian estates actually work.
                                    </p>
                                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-indigo-600">30</div>
                                            <div className="text-sm text-gray-500">Day Free Trial</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-indigo-600">₦20K</div>
                                            <div className="text-sm text-gray-500">Starting Price</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-indigo-600">24/7</div>
                                            <div className="text-sm text-gray-500">Cloud Access</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>

                        <footer className="py-16 text-center text-sm text-gray-500">
                            EstatePay &mdash; Digital estate management for Nigerian estates
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-start gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-950/5 transition hover:shadow-md">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                <svg
                    className="size-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                >
                    {icon}
                </svg>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <p className="mt-4 text-sm/relaxed text-gray-600">{description}</p>
            </div>
        </div>
    );
}
