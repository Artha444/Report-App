<?php

namespace App\Notifications;

use App\Models\DeviceToken;
use Illuminate\Container\Container;
use Illuminate\Notifications\Notification;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Exception\Messaging\InvalidArgument;
use Kreait\Firebase\Exception\Messaging\NotFound;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification as FirebaseNotification;

class FirebaseChannel
{
    public function send(object $notifiable, Notification $notification): void
    {
        if (! config('firebase.projects.app.credentials')) {
            return;
        }

        try {
            $messaging = Container::getInstance()->make(Messaging::class);
        } catch (\Throwable) {
            return;
        }

        if (! $data = $notification->toFirebase($notifiable)) {
            return;
        }

        $tokens = DeviceToken::where('user_id', $notifiable->id)->pluck('token')->unique();

        foreach ($tokens as $token) {
            $message = CloudMessage::new()
                ->withNotification(FirebaseNotification::create(
                    $data['title'] ?? '',
                    $data['body'] ?? '',
                ))
                ->withData($data['data'] ?? [])
                ->withToken($token);

            try {
                $messaging->send($message);
            } catch (NotFound|InvalidArgument) {
                DeviceToken::where('token', $token)->delete();
            }
        }
    }
}
