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
import { Badge } from "@/components/ui/badge"

// Mock data for now
const papers = [
    {
        id: "1",
        manufacturer: "한솔제지",
        product_name: "Hi-Q 밀레니엄 아트",
        basis_weight: 100,
        thickness: 95,
        whiteness: 120,
        smoothness: 400,
    },
    {
        id: "2",
        manufacturer: "무림페이퍼",
        product_name: "네오스타 아트",
        basis_weight: 100,
        thickness: 92,
        whiteness: 118,
        smoothness: 380,
    },
]

export function ResultsTable() {
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
                    {papers.map((paper) => (
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
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
