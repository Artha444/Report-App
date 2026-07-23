import type { ReportLog } from '@/types/reports';

export default function Timeline({ logs }: { logs: ReportLog[] }) {
    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Activity Log</h2>
            <div className="space-y-3">
                {logs.map((log) => (
                    <div key={log.id} className="bg-white rounded shadow p-3 flex justify-between">
                        <div>
                            <span className="font-medium">{log.user.name}</span>
                            {' '}{log.action.replace('_', ' ')}
                            {log.description && <p className="text-sm text-gray-500">{log.description}</p>}
                        </div>
                        <span className="text-sm text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
