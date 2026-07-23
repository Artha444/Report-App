<?php

namespace App\Notifications;

use App\Models\DeviceToken;
use Illuminate\Notifications\Notification;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Exception\Messaging\InvalidArgument;
use Kreait\Firebase\Exception\Messaging\NotFound;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification as FirebaseNotification;

class FirebaseChannel
{
    public function __construct(private Messaging $messaging) {}

    public function send(object $notifiable, Notification $notification): void
    {
        if (! $data = $notification->toFirebase($notifiable)) {
            return;
        }

        $tokens = DeviceToken::where('user_id', $notifiable->id)->pluck('token');

        foreach ($tokens as $token) {
            $message = CloudMessage::new()
                ->withNotification(FirebaseNotification::create(
                    $data['title'] ?? '',
                    $data['body'] ?? '',
                ))
                ->withData($data['data'] ?? [])
                ->withToken($token);

            try {
                $this->messaging->send($message);
            } catch (NotFound|InvalidArgument) {
                DeviceToken::where('token', $token)->delete();
            }
        }
    }
}
