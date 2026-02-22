// src/features/activity/data/activities.ts
import { ActivityItem } from '../types';

export const ACTIVITIES: ActivityItem[] = [
    {
        id: '1',
        type: 'chat',
        title: 'AI Case Analysis Complete',
        description: 'LexGrid AI successfully extracted 12 key timeline events from "Landlord_Dispute_v2.pdf".',
        timestamp: 'Today, 10:46 AM',
        status: 'Extracted',
        statusType: 'success',
        meta: 'Case #4492'
    },
    {
        id: '2',
        type: 'meeting',
        title: 'Strategy Consultation',
        description: 'Video session with Marcus Sterling regarding corporate restructuring strategy.',
        timestamp: 'Today, 09:15 AM',
        status: 'Completed',
        statusType: 'info',
        meta: '45 mins'
    },
    {
        id: '3',
        type: 'payment',
        title: 'Subscription Renewal',
        description: 'Monthly Professional Plan payment processed successfully.',
        timestamp: 'Yesterday, 04:00 PM',
        status: 'Paid',
        statusType: 'success',
        meta: '$199.00'
    },
    {
        id: '4',
        type: 'email',
        title: 'Disclosure Documents Sent',
        description: 'Legal disclosure packet delivered via encrypted transmission to OmniCorp Legal Counsel.',
        timestamp: 'Yesterday, 02:30 PM',
        status: 'Delivered',
        statusType: 'success',
        meta: '8 attachments'
    },
    {
        id: '5',
        type: 'notification',
        title: 'Urgent: Filing Deadline',
        description: 'Electronic filing for the Ontario Superior Court must be completed within 48 hours.',
        timestamp: 'Oct 22, 11:20 AM',
        status: 'Urgent',
        statusType: 'warning',
        meta: 'Matter #102'
    },
    {
        id: '6',
        type: 'chat',
        title: 'Statute Search Performed',
        description: 'AI Query: "Cross-border IP precedents in Delaware Chancery Court 2023".',
        timestamp: 'Oct 21, 03:45 PM',
        status: 'Resolved',
        statusType: 'info',
        meta: '14 citations found'
    },
    {
        id: '7',
        type: 'email',
        title: 'Retainer Agreement Signed',
        description: 'Electronic signature received from Julian Vance for new representation agreement.',
        timestamp: 'Oct 20, 09:12 AM',
        status: 'Executed',
        statusType: 'success'
    },
    {
        id: '8',
        type: 'payment',
        title: 'Invoice Overdue',
        description: 'Reminder: Invoice #INV-2024-001 for "Consulting Services" is 3 days past due.',
        timestamp: 'Oct 19, 10:00 AM',
        status: 'Overdue',
        statusType: 'error',
        meta: '$1,200.00'
    }
];
