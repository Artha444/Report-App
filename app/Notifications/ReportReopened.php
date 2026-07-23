<?php

namespace App\Notifications;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReportReopened extends Notification
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
            ->line("Report '{$this->report->title}' has been reopened and needs attention.")
            ->action('View Report', route('reports.show', $this->report));
    }

    public function toFirebase(object $notifiable): array
    {
        return [
            'title' => 'Report Reopened',
            'body' => "Report '{$this->report->title}' has been reopened",
            'data' => ['report_id' => (string) $this->report->id, 'type' => 'report_reopened'],
        ];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'report_id' => $this->report->id,
            'title' => $this->report->title,
            'type' => 'report_reopened',
        ];
    }
}
