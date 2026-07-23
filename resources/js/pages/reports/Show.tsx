import AppLayout from '@/components/AppLayout';
import DetailCard from '@/components/report/DetailCard';
import Timeline from '@/components/report/Timeline';
import ReopenDialog from '@/components/report/ReopenDialog';
import type { Report } from '@/types/reports';
import { Head, usePage } from '@inertiajs/react';
import type React from 'react';
import type { Auth } from '@/types/auth';

export default function ReportShow({ report }: { report: Report }) {
    const { auth } = usePage().props as { auth: Auth };
    const canReopen = report.status === 'resolved' && report.user.id === auth.user.id;

    return (
        <div className="max-w-3xl mx-auto">
            <Head title={report.title} />
            <h1 className="sr-only">{report.title}</h1>

            <DetailCard report={report} />

            {report.images.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Images</h2>
                    <div className="flex gap-2 flex-wrap">
                        {report.images.map((img) => (
                            <img key={img.id} src={img.url} className="w-40 h-40 object-cover rounded" alt="" />
                        ))}
                    </div>
                </div>
            )}

            <Timeline logs={report.logs} />

            {canReopen && (
                <div className="mt-6">
                    <ReopenDialog reportId={report.id} />
                </div>
            )}
        </div>
    );
}

ReportShow.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
