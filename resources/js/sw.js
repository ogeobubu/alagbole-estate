// Service Worker for EstatePay Push Notifications

self.addEventListener('push', function (event) {
    let data = { title: 'EstatePay', body: 'You have a new notification', url: '/' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || '/icon-192.png',
        badge: data.badge || '/icon-192.png',
        data: { url: data.url || '/' },
        vibrate: [200, 100, 200],
        tag: 'estatepay-notification',
        renotify: true,
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options),
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const url = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            for (const client of clientList) {
                if (client.url.includes(url) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        }),
    );
});
