"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBar() {
    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="제품명 또는 제조사 검색..." className="pl-8" />
        </div>
    )
}
