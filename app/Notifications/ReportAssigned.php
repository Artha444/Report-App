<?php

namespace App\Notifications;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReportAssigned extends Notification
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
            ->line("Report assigned to your team: {$this->report->title}")
            ->action('View Report', route('team.reports'));
    }

    public function toFirebase(object $notifiable): array
    {
        return [
            'title' => 'Report Assigned',
            'body' => "{$this->report->title} assigned to your team",
            'data' => ['report_id' => (string) $this->report->id, 'type' => 'report_assigned'],
        ];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'report_id' => $this->report->id,
            'title' => $this->report->title,
            'type' => 'report_assigned',
        ];
    }
}
