"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Mock state for now
const selectedItems = [
    { id: "1", name: "Hi-Q 밀레니엄 아트" },
    { id: "2", name: "네오스타 아트" },
]

export function ComparisonCart() {
    if (selectedItems.length === 0) return null

    return (
        <div className="fixed bottom-6 right-6 z-50 w-80">
            <Card className="p-4 shadow-lg border-primary/20">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">비교함</span>
                        <Badge variant="secondary">{selectedItems.length}</Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-2 mb-4 max-h-40 overflow-auto">
                    {selectedItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                            <span className="truncate">{item.name}</span>
                            <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-destructive">
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>

                <Button className="w-full" asChild>
                    <Link href="/compare">
                        비교 분석 시작하기
                    </Link>
                </Button>
            </Card>
        </div>
    )
}
