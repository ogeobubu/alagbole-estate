import { useState, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

interface AdminUser {
    name: string;
    email: string;
}

interface PageProps {
    auth: {
        user: AdminUser;
    };
}

interface AdminLayoutProps {
    header?: string;
    children: ReactNode;
}

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Roles', href: '/admin/roles', icon: '🔑' },
    { name: 'Estates', href: '/estates', icon: '🏠' },
];

export default function AdminLayout({ header, children }: AdminLayoutProps) {
    const { auth } = usePage().props as PageProps;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
                    <div className="flex h-16 items-center justify-between px-4 border-b">
                        <Link href="/admin" className="text-xl font-bold text-indigo-600">
                            EstatePay Admin
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
                            ✕
                        </button>
                    </div>
                    <nav className="mt-4 px-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mb-1 ${
                                    window.location.pathname === item.href || window.location.pathname.startsWith(item.href + '/')
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span>{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col border-r border-gray-200 bg-white">
                    <div className="flex h-16 items-center px-4 border-b">
                        <Link href="/admin" className="text-xl font-bold text-indigo-600">
                            EstatePay Admin
                        </Link>
                    </div>
                    <nav className="mt-4 flex-1 px-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mb-1 ${
                                    window.location.pathname === item.href || window.location.pathname.startsWith(item.href + '/')
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span>{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="border-t p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        ☰
                    </button>
                    <div className="flex-1 flex justify-between items-center">
                        {header && (
                            <h1 className="text-lg font-semibold text-gray-900">{header}</h1>
                        )}
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                                ← Back to App
                            </Link>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                                        <span>{user.name}</span>
                                        <span>▾</span>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href="/profile">Profile</Dropdown.Link>
                                    <Dropdown.Link href="/logout" method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
