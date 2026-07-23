import { subscribeToPush, unsubscribeFromPush, isPushSubscribed } from '@/utils/push';
import { useEffect, useState } from 'react';

export default function NotificationBell() {
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        const check = async () => {
            setSupported('serviceWorker' in navigator && 'PushManager' in window);
            setSubscribed(await isPushSubscribed());
            setLoading(false);
        };
        check();
    }, []);

    const toggle = async () => {
        setLoading(true);
        if (subscribed) {
            await unsubscribeFromPush();
            setSubscribed(false);
        } else {
            const success = await subscribeToPush();
            setSubscribed(success);
        }
        setLoading(false);
    };

    if (!supported || loading) {
        return null;
    }

    return (
        <button
            onClick={toggle}
            className="relative inline-flex items-center rounded-md p-2 text-gray-400 transition hover:text-gray-600 focus:outline-none"
            title={subscribed ? 'Disable notifications' : 'Enable notifications'}
        >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
            </svg>
            {subscribed && (
                <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                </span>
            )}
        </button>
    );
}
