import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="EstatePay — Digital Estate Management" />
            <div className="bg-white">
                {/* Navigation */}
                <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900">EstatePay</span>
                        </Link>

                        <div className="hidden items-center gap-8 md:flex">
                            <a href="#features" className="text-sm text-gray-600 transition hover:text-gray-900">Features</a>
                            <a href="#how-it-works" className="text-sm text-gray-600 transition hover:text-gray-900">How It Works</a>
                            <a href="#pricing" className="text-sm text-gray-600 transition hover:text-gray-900">Pricing</a>
                        </div>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-full px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
                                    >
                                        Start Free Trial
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
                    {/* Background decoration */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 -translate-y-1/2">
                            <div className="h-[600px] w-[600px] rounded-full bg-indigo-100/60 blur-3xl" />
                        </div>
                        <div className="absolute right-0 bottom-0 -z-10">
                            <div className="h-[400px] w-[400px] rounded-full bg-purple-100/40 blur-3xl" />
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                                </span>
                                Now live in Alagbole, Lagos
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                                Stop chasing{' '}
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    estate payments
                                </span>
                            </h1>

                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
                                EstatePay automates dues collection for Nigerian estates.
                                Tenants pay online, you track everything in real-time.
                                No more WhatsApp chaos, no more Excel sheets.
                            </p>

                            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                <Link
                                    href={route('register')}
                                    className="group relative inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95"
                                >
                                    Start Free for 30 Days
                                    <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-8 py-4 text-base font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-95"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                                    </svg>
                                    See How It Works
                                </a>
                            </div>
                        </div>

                        {/* Hero visual — dashboard mockup */}
                        <div className="mx-auto mt-20 max-w-5xl">
                            <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl shadow-gray-900/10 sm:p-4">
                                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8">
                                    {/* Mini dashboard preview */}
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="h-3 w-3 rounded-full bg-red-400" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                        <div className="h-3 w-3 rounded-full bg-green-400" />
                                        <span className="ml-4 text-xs text-gray-400">EstatePay Dashboard</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                                        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-950/5">
                                            <div className="text-xs text-gray-500">Total Tenants</div>
                                            <div className="mt-1 text-2xl font-bold text-gray-900">12</div>
                                            <div className="mt-1 text-xs text-green-600">Active</div>
                                        </div>
                                        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-950/5">
                                            <div className="text-xs text-gray-500">Paid This Month</div>
                                            <div className="mt-1 text-2xl font-bold text-green-600">8</div>
                                            <div className="mt-1 text-xs text-gray-400">of 12 tenants</div>
                                        </div>
                                        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-950/5">
                                            <div className="text-xs text-gray-500">Pending</div>
                                            <div className="mt-1 text-2xl font-bold text-amber-500">4</div>
                                            <div className="mt-1 text-xs text-amber-600">Reminders sent</div>
                                        </div>
                                        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-950/5">
                                            <div className="text-xs text-gray-500">Collected</div>
                                            <div className="mt-1 text-2xl font-bold text-indigo-600">₦120K</div>
                                            <div className="mt-1 text-xs text-gray-400">This month</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-950/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-700">Recent Payments</span>
                                            <span className="text-xs text-indigo-600">View All</span>
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { name: 'Adebayo Johnson', apt: 'A1', amount: '₦15,000', status: 'paid' },
                                                { name: 'Chioma Okwu', apt: 'A2', amount: '₦15,000', status: 'paid' },
                                                { name: 'Tunde Williams', apt: 'A3', amount: '₦12,000', status: 'pending' },
                                            ].map((p, i) => (
                                                <div key={i} className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
                                                            {p.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{p.name}</div>
                                                            <div className="text-xs text-gray-500">Apt {p.apt}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium text-gray-900">{p.amount}</div>
                                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            p.status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                                                        }`}>
                                                            {p.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Logos / Social proof */}
                <section className="border-y border-gray-100 bg-gray-50/50 py-10">
                    <div className="mx-auto max-w-7xl px-6">
                        <p className="text-center text-sm font-medium text-gray-400">
                            Trusted by estate managers across Alagbole and beyond
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-8 sm:gap-12 opacity-40">
                            {['Royalty Estate', 'Glorious Estate', 'Nicon Town', 'L & D Estate', 'Pet-Alu Estate'].map((name) => (
                                <span key={name} className="text-sm font-semibold text-gray-900 sm:text-base">{name}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="py-20 sm:py-28">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Everything you need to manage estate payments
                            </h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Built specifically for Nigerian estate management — from tenant tracking to instant payment confirmations.
                            </p>
                        </div>

                        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <FeatureCard
                                color="indigo"
                                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />}
                                title="Real-Time Dashboard"
                                description="See who paid and who hasn't at a glance. Your complete financial picture, updated instantly."
                            />
                            <FeatureCard
                                color="emerald"
                                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />}
                                title="Instant Payments"
                                description="Tenants pay via bank transfer, Paystack, or POS. Digital receipts auto-generated and sent instantly."
                            />
                            <FeatureCard
                                color="amber"
                                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />}
                                title="Auto SMS Reminders"
                                description="Automatic SMS reminders go out to tenants with pending dues. You stop chasing — the system handles it."
                            />
                            <FeatureCard
                                color="rose"
                                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />}
                                title="Digital Receipts"
                                description="Every payment gets a professional receipt. No more handwritten notes — instant, shareable, and searchable."
                            />
                            <FeatureCard
                                color="cyan"
                                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />}
                                title="Multi-Tenant Access"
                                description="Chairmen, landlords, and tenants each get their own view. Everyone stays informed, nobody is left out."
                            />
                            <FeatureCard
                                color="violet"
                                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />}
                                title="Financial Reports"
                                description="Generate monthly and annual reports instantly. Tax-ready, audit-ready, always accurate."
                            />
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section id="how-it-works" className="bg-gray-50 py-20 sm:py-28">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Get started in 3 simple steps
                            </h2>
                            <p className="mt-4 text-lg text-gray-600">
                                From sign-up to your first payment tracked — in under 10 minutes.
                            </p>
                        </div>

                        <div className="mx-auto mt-16 grid max-w-4xl gap-8 lg:grid-cols-3">
                            <StepCard
                                number="1"
                                title="Create Your Estate"
                                description="Enter your estate name, address, and monthly dues amount. Takes less than 2 minutes."
                            />
                            <StepCard
                                number="2"
                                title="Add Your Tenants"
                                description="Add tenant names, apartment numbers, and phone numbers. Import from your existing records."
                            />
                            <StepCard
                                number="3"
                                title="Start Collecting"
                                description="Tenants receive payment links. You get real-time tracking and automatic receipts."
                            />
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-20 sm:py-28">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mx-auto max-w-5xl rounded-3xl bg-gray-900 px-8 py-16 sm:px-16">
                            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-white sm:text-5xl">30</div>
                                    <div className="mt-2 text-sm text-gray-400">Days Free Trial</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-white sm:text-5xl">₦20K</div>
                                    <div className="mt-2 text-sm text-gray-400">Starting / Month</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-white sm:text-5xl">10+</div>
                                    <div className="mt-2 text-sm text-gray-400">Estates Onboarded</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-white sm:text-5xl">24/7</div>
                                    <div className="mt-2 text-sm text-gray-400">Cloud Access</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section id="pricing" className="py-20 sm:py-28">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Simple, transparent pricing
                            </h2>
                            <p className="mt-4 text-lg text-gray-600">
                                No hidden fees. No contracts. Cancel anytime.
                            </p>
                        </div>

                        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
                            <PricingCard
                                name="Small Estate"
                                units="1 – 50 units"
                                price="₦20,000"
                                period="/month"
                                features={[
                                    'Unlimited tenants',
                                    'Payment tracking',
                                    'SMS reminders (100/mo)',
                                    'Digital receipts',
                                    'Basic dashboard',
                                ]}
                                cta="Start Free Trial"
                                highlighted={false}
                            />
                            <PricingCard
                                name="Medium Estate"
                                units="51 – 150 units"
                                price="₦35,000"
                                period="/month"
                                features={[
                                    'Everything in Small',
                                    'SMS reminders (300/mo)',
                                    'Push notifications',
                                    'Financial reports',
                                    'Multi-admin access',
                                ]}
                                cta="Start Free Trial"
                                highlighted={true}
                            />
                            <PricingCard
                                name="Large Estate"
                                units="151+ units"
                                price="₦50,000"
                                period="/month"
                                features={[
                                    'Everything in Medium',
                                    'Unlimited SMS',
                                    'Priority support',
                                    'Custom branding',
                                    'API access',
                                ]}
                                cta="Contact Sales"
                                highlighted={false}
                            />
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 sm:py-28">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-8 py-16 sm:px-16 sm:py-20">
                            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/50 blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl" />

                            <div className="relative mx-auto max-w-2xl text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                    Ready to stop chasing payments?
                                </h2>
                                <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
                                    Join estate managers who have automated their dues collection.
                                    Start your free trial today — no credit card required.
                                </p>
                                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-indigo-600 shadow-lg transition hover:bg-gray-50 active:scale-95"
                                    >
                                        Start Free for 30 Days
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-100 bg-gray-50">
                    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">EstatePay</span>
                                </div>
                                <p className="mt-4 text-sm leading-relaxed text-gray-500">
                                    Digital estate management for Nigerian estates. Built in Alagbole, designed for everywhere.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Product</h3>
                                <ul className="mt-4 space-y-3">
                                    <li><a href="#features" className="text-sm text-gray-500 transition hover:text-gray-900">Features</a></li>
                                    <li><a href="#pricing" className="text-sm text-gray-500 transition hover:text-gray-900">Pricing</a></li>
                                    <li><a href="#how-it-works" className="text-sm text-gray-500 transition hover:text-gray-900">How It Works</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Company</h3>
                                <ul className="mt-4 space-y-3">
                                    <li><span className="text-sm text-gray-500">About</span></li>
                                    <li><span className="text-sm text-gray-500">Blog</span></li>
                                    <li><span className="text-sm text-gray-500">Contact</span></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Support</h3>
                                <ul className="mt-4 space-y-3">
                                    <li><span className="text-sm text-gray-500">Help Center</span></li>
                                    <li><span className="text-sm text-gray-500">Privacy Policy</span></li>
                                    <li><span className="text-sm text-gray-500">Terms of Service</span></li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
                            <p className="text-sm text-gray-400">
                                &copy; {new Date().getFullYear()} EstatePay. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function FeatureCard({ color, icon, title, description }: { color: string; icon: React.ReactNode; title: string; description: string }) {
    const colors: Record<string, { bg: string; stroke: string }> = {
        indigo: { bg: 'bg-indigo-100', stroke: 'text-indigo-600' },
        emerald: { bg: 'bg-emerald-100', stroke: 'text-emerald-600' },
        amber: { bg: 'bg-amber-100', stroke: 'text-amber-600' },
        rose: { bg: 'bg-rose-100', stroke: 'text-rose-600' },
        cyan: { bg: 'bg-cyan-100', stroke: 'text-cyan-600' },
        violet: { bg: 'bg-violet-100', stroke: 'text-violet-600' },
    };
    const c = colors[color] || colors.indigo;

    return (
        <div className="group relative rounded-2xl border border-gray-200 bg-white p-8 transition hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.bg}`}>
                <svg className={`h-6 w-6 ${c.stroke}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    {icon}
                </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
        </div>
    );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <div className="relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-950/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {number}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
        </div>
    );
}

function PricingCard({ name, units, price, period, features, cta, highlighted }: {
    name: string;
    units: string;
    price: string;
    period: string;
    features: string[];
    cta: string;
    highlighted: boolean;
}) {
    return (
        <div className={`relative rounded-2xl p-8 ${
            highlighted
                ? 'bg-gray-900 text-white ring-2 ring-indigo-500'
                : 'bg-white text-gray-900 ring-1 ring-gray-200'
        }`}>
            {highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-indigo-500 px-4 py-1 text-xs font-semibold text-white">
                        Most Popular
                    </span>
                </div>
            )}
            <div className="text-sm font-medium text-gray-500" style={highlighted ? { color: '#9ca3af' } : {}}>
                {units}
            </div>
            <h3 className="mt-2 text-xl font-bold">{name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{price}</span>
                <span className="text-sm" style={highlighted ? { color: '#9ca3af' } : { color: '#6b7280' }}>{period}</span>
            </div>
            <ul className="mt-8 space-y-3">
                {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                        <svg className={`h-5 w-5 shrink-0 ${highlighted ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {f}
                    </li>
                ))}
            </ul>
            <Link
                href={route('register')}
                className={`mt-8 block w-full rounded-full py-3 text-center text-sm font-semibold transition active:scale-95 ${
                    highlighted
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
            >
                {cta}
            </Link>
        </div>
    );
}
