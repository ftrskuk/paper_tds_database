"use client"

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

interface PaperSpec {
    id: string
    manufacturer: string
    product_name: string
    basis_weight: number
    thickness: number
    whiteness: number
    smoothness: number
    [key: string]: any
}

interface ResultsTableProps {
    papers: PaperSpec[]
}

export function ResultsTable({ papers }: ResultsTableProps) {
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
