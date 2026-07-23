<?php

namespace App\Notifications;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReportSubmitted extends Notification
{
    use Queueable;

    public function __construct(public Report $report) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail', FirebaseChannel::class];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line("New report submitted: {$this->report->title}")
            ->action('View Report', route('admin.reports'));
    }

    public function toFirebase(object $notifiable): array
    {
        return [
            'title' => 'New Report',
            'body' => "{$this->report->user->name} submitted: {$this->report->title}",
            'data' => ['report_id' => (string) $this->report->id, 'type' => 'new_report'],
        ];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'report_id' => $this->report->id,
            'title' => $this->report->title,
            'type' => 'new_report',
        ];
    }
}
