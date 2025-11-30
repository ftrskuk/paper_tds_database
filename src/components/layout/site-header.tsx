import { UserNav } from "@/components/layout/user-nav"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-end">
                <div className="flex items-center gap-2">
                    {/* Placeholder for User Nav or other header items */}
                    <div className="text-sm text-muted-foreground">Admin User</div>
                </div>
            </div>
        </header>
    )
}
