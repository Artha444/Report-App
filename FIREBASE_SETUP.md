# Firebase Push Notification Setup

## Prasyarat

- Akun Google
- Sudah clone repo & jalankan `composer install` + `npm install`

## Langkah 1: Buat Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Klik **Add project**
3. Isi nama project, klik **Continue**
4. Nonaktifkan Google Analytics (opsional), klik **Create project**

## Langkah 2: Buat Web App

1. Di halaman project, klik ikon **Web** (`</>`)
2. Beri nama app (misal: `ReportApp`), klik **Register app**
3. Copy config values yang ditampilkan, kita akan pakai di Langkah 4

## Langkah 3: Download Service Account Key

1. Buka **Project Settings** (ikon gear ⚙️ di atas kiri)
2. Tab **Service accounts**
3. Klik **Generate new private key**
4. Simpan file sebagai `serviceAccount.json` di **root folder project** (samping `composer.json`)

> **Penting:** File `serviceAccount.json` sudah di-gitignore. Jangan commit ke GitHub.

## Langkah 4: Isi Environment Variables

Buka file `.env`, tambahkan / update baris berikut:

```
FIREBASE_CREDENTIALS=serviceAccount.json

VITE_FIREBASE_API_KEY=AIzaSy...          # dari Langkah 2
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=1:xxx:web:xxx
VITE_FIREBASE_VAPID_KEY=xxx              # dari Cloud Messaging tab
```

### Cara dapat VAPID Key:

1. **Project Settings** → tab **Cloud Messaging**
2. Di bagian **Web push certificates**, klik **Generate key pair**
3. Copy Public Key → paste sebagai `VITE_FIREBASE_VAPID_KEY`

## Langkah 5: Test

1. Jalankan `npm run dev`
2. Login sebagai `test@example.com` / `password`
3. Buka `/test-notification`
4. Klik **Aktifkan Notifikasi** → izinkan permission
5. Klik **Kirim Test Notifikasi**
6. Notifikasi harusnya muncul

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| "Firebase belum terkonfigurasi" | Cek `serviceAccount.json` ada di root & `FIREBASE_CREDENTIALS=serviceAccount.json` di `.env` |
| Token tidak terdaftar | Pastikan `VITE_FIREBASE_*` semua terisi di `.env`, lalu restart `npm run dev` |
| Notifikasi tidak muncul | Cek settingan notifikasi OS/ browser tidak dalam keadaan mati |
| Error di console | Buka F12 → Console, cari log `[FCM]` |
