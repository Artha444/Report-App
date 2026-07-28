import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

let messagingInitialized = false;

function initForegroundListener() {
    if (messagingInitialized || typeof window === 'undefined') return;
    if (Notification.permission !== 'granted') return;

    try {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
            const title = payload.notification?.title ?? 'Notifikasi';
            const body = payload.notification?.body ?? '';
            new Notification(title, { body, icon: '/favicon.svg' });
        });
        messagingInitialized = true;
    } catch {
        // messaging not ready yet
    }
}

export async function requestNotificationPermission(): Promise<string | null> {
    if (typeof window === 'undefined') return null;

    try {
        if ('serviceWorker' in navigator) {
            await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        }
        const registration = await navigator.serviceWorker.ready;

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return null;

        const messaging = getMessaging(app);
        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration,
        });

        initForegroundListener();

        return token;
    } catch (err) {
        console.error('[FCM] Error:', err);
        return null;
    }
}

export function setupForegroundListener() {
    initForegroundListener();
}
