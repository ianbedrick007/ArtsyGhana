import { cn } from '@/lib/utils'

interface StatusBadgeProps {
    status: string
    className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const statusStyles = {
        // Order statuses
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
        SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
        DELIVERED: 'bg-green-100 text-green-800 border-green-200',
        CANCELLED: 'bg-red-100 text-red-800 border-red-200',

        // Payment statuses
        SUCCESS: 'bg-green-100 text-green-800 border-green-200',
        FAILED: 'bg-red-100 text-red-800 border-red-200',
        REFUNDED: 'bg-gray-100 text-gray-800 border-gray-200',

        // Artist statuses
        APPROVED: 'bg-green-100 text-green-800 border-green-200',
        REJECTED: 'bg-red-100 text-red-800 border-red-200',

        // Exhibition statuses
        UPCOMING: 'bg-blue-100 text-blue-800 border-blue-200',
        LIVE: 'bg-green-100 text-green-800 border-green-200',
        ENDED: 'bg-gray-100 text-gray-800 border-gray-200',
    }

    const style = statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800 border-gray-200'

    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider',
            style,
            className
        )}>
            {status}
        </span>
    )
}
