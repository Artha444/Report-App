<?php

namespace App\Http\Controllers;

use App\Models\DeviceToken;
use Illuminate\Http\Request;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification as FirebaseNotification;

class TestNotificationController extends Controller
{
    public function index()
    {
        return inertia('TestNotification');
    }

    public function send(Request $request)
    {
        $user = $request->user();
        $tokens = DeviceToken::where('user_id', $user->id)->pluck('token');

        if ($tokens->isEmpty()) {
            return back()->withErrors(['error' => 'Tidak ada device token terdaftar. Allow notifikasi di browser dulu.']);
        }

        try {
            $messaging = app(Messaging::class);
        } catch (\Throwable) {
            return back()->withErrors(['error' => 'Firebase belum terkonfigurasi.']);
        }

        $sent = 0;
        foreach ($tokens as $token) {
            $message = CloudMessage::new()
                ->withNotification(FirebaseNotification::create(
                    'Test Notifikasi 🔔',
                    "Halo {$user->name}! Push notification berhasil dikirim.",
                ))
                ->withData(['type' => 'test', 'user_id' => (string) $user->id])
                ->withToken($token);

            try {
                $messaging->send($message);
                $sent++;
            } catch (\Throwable) {
                DeviceToken::where('token', $token)->delete();
            }
        }

        return back()->with('success', "Notifikasi terkirim ke {$sent} device.");
    }
}
