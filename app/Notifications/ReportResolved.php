<?php

namespace App\Notifications;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReportResolved extends Notification
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
            ->line("Your report '{$this->report->title}' has been resolved.")
            ->action('View Report', route('reports.show', $this->report));
    }

    public function toFirebase(object $notifiable): array
    {
        return [
            'title' => 'Report Resolved',
            'body' => "Your report '{$this->report->title}' has been resolved",
            'data' => ['report_id' => (string) $this->report->id, 'type' => 'report_resolved'],
        ];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'report_id' => $this->report->id,
            'title' => $this->report->title,
            'type' => 'report_resolved',
        ];
    }
}
