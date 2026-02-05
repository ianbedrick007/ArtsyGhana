export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Clean layout for auth pages - no header, no sidebar, no navigation
    return <>{children}</>
}
