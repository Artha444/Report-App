importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'AIzaSyCpeThyBgizD2h2aBGXqJAScNrodMgM4OI',
    authDomain: 'push-notifications-81935.firebaseapp.com',
    projectId: 'push-notifications-81935',
    messagingSenderId: '158175245933',
    appId: '1:158175245933:web:480da9db36372c1bc1b164',
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
    const { title, body } = payload.notification ?? {};

    self.registration.showNotification(title ?? 'Notification', {
        body: body ?? '',
        icon: '/favicon.svg',
    });
});
