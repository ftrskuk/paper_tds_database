"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function ResultsTable() {
    const [papers, setPapers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPapers = async () => {
            setIsLoading(true)
            const supabase = createClient()
            const { data, error } = await supabase
                .from('paper_specs')
                .select('*')
                .order('created_at', { ascending: false })

            if (data) {
                setPapers(data)
            }
            setIsLoading(false)
        }

        fetchPapers()
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox />
                        </TableHead>
                        <TableHead>제조사</TableHead>
                        <TableHead>제품명</TableHead>
                        <TableHead>평량 (g/m²)</TableHead>
                        <TableHead>두께 (μm)</TableHead>
                        <TableHead>백색도 (CIE)</TableHead>
                        <TableHead>평활도 (Bekk)</TableHead>
                        <TableHead className="text-right">액션</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {papers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                등록된 데이터가 없습니다.
                            </TableCell>
                        </TableRow>
                    ) : (
                        papers.map((paper) => (
                            <TableRow key={paper.id}>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell>{paper.manufacturer}</TableCell>
                                <TableCell className="font-medium">{paper.product_name}</TableCell>
                                <TableCell>{paper.basis_weight}</TableCell>
                                <TableCell>{paper.thickness}</TableCell>
                                <TableCell>{paper.whiteness}</TableCell>
                                <TableCell>{paper.smoothness}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">상세보기</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
