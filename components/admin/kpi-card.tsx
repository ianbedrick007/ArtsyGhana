import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
    title: string
    value: string | number
    subtitle?: string
    icon: LucideIcon
    trend?: {
        value: string
        positive: boolean
    }
    className?: string
}

export function KPICard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    className
}: KPICardProps) {
    return (
        <div className={cn(
            'glass rounded-lg p-6 shadow-lg hover:shadow-xl transition-all',
            className
        )}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-warm-gray font-medium mb-2">
                        {title}
                    </p>
                    <h3 className="text-3xl font-serif text-charcoal mb-1">
                        {value}
                    </h3>
                    {subtitle && (
                        <p className="text-sm text-warm-gray">
                            {subtitle}
                        </p>
                    )}
                    {trend && (
                        <div className={cn(
                            'mt-2 inline-flex items-center gap-1 text-xs font-medium',
                            trend.positive ? 'text-green-600' : 'text-red-600'
                        )}>
                            <span>{trend.positive ? '↑' : '↓'}</span>
                            <span>{trend.value}</span>
                        </div>
                    )}
                </div>
                <div className="bg-burnished-gold/10 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-burnished-gold" />
                </div>
            </div>
        </div>
    )
}
