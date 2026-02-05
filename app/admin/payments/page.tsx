import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/admin/status-badge'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function PaymentsPage() {
    const payments = await prisma.payment.findMany({
        include: {
            order: {
                select: {
                    orderNumber: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return (
        <div className="min-h-screen bg-dark-white p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-2">
                    Payments
                </h1>
                <p className="text-warm-gray uppercase tracking-widest text-sm">
                    Track payment transactions
                </p>
            </div>

            {/* Payments Table */}
            <div className="glass rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-charcoal/5 border-b border-warm-gray/20">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                                    Reference
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                                    Order #
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                                    Customer
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                                    Method
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-warm-gray/20">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-white/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs text-charcoal">
                                            {payment.paystackRef || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm text-charcoal">
                                            #{payment.order.orderNumber}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-charcoal">{payment.order.name}</p>
                                            <p className="text-sm text-warm-gray">{payment.order.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-charcoal">
                                            {payment.currency} {payment.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-warm-gray capitalize">
                                            {payment.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={payment.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-warm-gray">
                                            {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {payments.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-warm-gray">No payments yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
