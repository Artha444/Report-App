export type ReportStatus = 'pending' | 'confirmed' | 'in_progress' | 'resolved' | 'rejected' | 'reopened';

export type Report = {
    id: number;
    title: string;
    description: string;
    location: string;
    priority: string;
    status: ReportStatus;
    rejection_reason: string | null;
    user_feedback: string | null;
    resolution_evidence: string | null;
    resolution_notes: string | null;
    user: { id: number; name: string };
    team: { id: number; name: string } | null;
    images: ReportImage[];
    logs: ReportLog[];
    created_at: string;
    confirmed_at: string | null;
    resolved_at: string | null;
};

export type ReportImage = {
    id: number;
    url: string;
};

export type ReportLog = {
    id: number;
    action: string;
    description: string | null;
    created_at: string;
    user: { name: string };
};
