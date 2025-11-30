"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, Copy, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { TdsFormDialog } from "@/components/tds-form-dialog"
import { type PaperSpec } from "@/app/actions/save-specs"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function AdminPage() {
    const [specs, setSpecs] = useState<PaperSpec[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedSpec, setSelectedSpec] = useState<PaperSpec | undefined>(undefined)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const fetchSpecs = async () => {
        setIsLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from('paper_specs')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) {
            setSpecs(data)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchSpecs()
    }, [])

    const handleCopy = (spec: PaperSpec) => {
        // Create a copy without ID and created_at
        const { ...copyData } = spec
        // @ts-ignore - ID is auto-generated
        delete copyData.id
        // @ts-ignore - created_at is auto-generated
        delete copyData.created_at

        setSelectedSpec(copyData)
        setIsDialogOpen(true)
    }

    const handleAddNew = () => {
        setSelectedSpec(undefined)
        setIsDialogOpen(true)
    }

    const handleSuccess = () => {
        fetchSpecs()
        setIsDialogOpen(false)
    }

    return (
        <div className="flex flex-col gap-6 h-full pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">데이터 관리</h1>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    TDS 추가
                </Button>
            </div>

            <TdsFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedSpec}
                onSuccess={handleSuccess}
            />

            <Card>
                <CardHeader>
                    <CardTitle>등록된 TDS 목록 ({specs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>제조사</TableHead>
                                    <TableHead>제품명</TableHead>
                                    <TableHead>평량 (g/m²)</TableHead>
                                    <TableHead>두께 (µm)</TableHead>
                                    <TableHead>백색도</TableHead>
                                    <TableHead>원본 파일</TableHead>
                                    <TableHead className="text-right">작업</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {specs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            등록된 데이터가 없습니다.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    specs.map((spec: any) => (
                                        <TableRow key={spec.id}>
                                            <TableCell>{spec.manufacturer}</TableCell>
                                            <TableCell className="font-medium">{spec.product_name}</TableCell>
                                            <TableCell>{spec.basis_weight}</TableCell>
                                            <TableCell>{spec.thickness}</TableCell>
                                            <TableCell>{spec.whiteness}</TableCell>
                                            <TableCell>
                                                {spec.tds_file_url ? (
                                                    <a
                                                        href={spec.tds_file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-blue-600 hover:underline"
                                                    >
                                                        <FileText className="mr-1 h-4 w-4" />
                                                        PDF
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCopy(spec)}
                                                    title="복사하여 새 항목 만들기"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
