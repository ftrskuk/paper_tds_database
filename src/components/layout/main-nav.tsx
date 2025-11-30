"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, BarChart2, Upload, Settings } from "lucide-react"

const sidebarNavItems = [
    {
        title: "대시보드",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "비교 분석",
        href: "/compare",
        icon: BarChart2,
    },
    {
        title: "데이터 관리",
        href: "/admin",
        icon: Upload,
    },
]

interface MainNavProps extends React.HTMLAttributes<HTMLDivElement> { }

export function MainNav({ className, ...props }: MainNavProps) {
    const pathname = usePathname()

    return (
        <div className={cn("flex flex-col h-full border-r bg-background", className)} {...props}>
            <div className="p-6">
                <h2 className="text-lg font-bold tracking-tight text-primary">PaperSpec TDS</h2>
            </div>
            <ScrollArea className="flex-1 px-4">
                <nav className="flex flex-col gap-2">
                    {sidebarNavItems.map((item) => (
                        <Button
                            key={item.href}
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            className={cn("justify-start", pathname === item.href && "bg-secondary")}
                            asChild
                        >
                            <Link href={item.href}>
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Link>
                        </Button>
                    ))}
                </nav>
            </ScrollArea>
            <div className="p-4 border-t">
                <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    설정
                </Button>
            </div>
        </div>
    )
}
