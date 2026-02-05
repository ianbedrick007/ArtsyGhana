'use client'

import { Navigation } from '@/components/navigation'
import { usePathname } from 'next/navigation'

export function ConditionalNav({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith('/admin')

    return (
        <>
            {!isAdminRoute && <Navigation />}
            <main>{children}</main>
        </>
    )
}
