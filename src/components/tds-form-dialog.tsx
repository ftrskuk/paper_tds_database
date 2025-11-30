
"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Loader2, Plus, X, Upload, Copy, FileText } from "lucide-react" // Added FileText
import { EXTRA_SPECS_OPTIONS } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"
import { saveSpecsAction, type PaperSpec } from "@/app/actions/save-specs"
import { Card, CardContent } from "@/components/ui/card" // Added Card, CardContent

interface TdsFormDialogProps {
    trigger?: React.ReactNode
    initialData?: PaperSpec
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onSuccess?: () => void
}

// Define types for local state
type CommonData = {
    manufacturer: string
    product_name: string
    tds_file_url?: string
}

type SpecVariant = Omit<PaperSpec, 'manufacturer' | 'product_name' | 'tds_file_url'> & {
    id: string // Temporary ID for UI handling
}

const createEmptyVariant = (): SpecVariant => ({
    id: Math.random().toString(36).substr(2, 9),
    basis_weight: 0,
    thickness: 0,
    whiteness: 0,
    smoothness: 0,
    cobb_value: 0,
    tensile_strength_md: 0,
    tensile_strength_cd: 0,
    tearing_strength_md: 0,
    tearing_strength_cd: 0,
    extra_specs: {},
})

export function TdsFormDialog({ trigger, initialData, open, onOpenChange, onSuccess }: TdsFormDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    // State for Common Info
    const [commonData, setCommonData] = useState<CommonData>({
        manufacturer: "",
        product_name: "",
    })

    // State for Variants
    const [variants, setVariants] = useState<SpecVariant[]>([createEmptyVariant()])

    // File State
    const [file, setFile] = useState<File | null>(null)

    useEffect(() => {
        if (initialData) {
            // If copying/editing, populate common data and create one variant
            setCommonData({
                manufacturer: initialData.manufacturer,
                product_name: initialData.product_name,
                tds_file_url: initialData.tds_file_url,
            })
            setVariants([{
                ...initialData,
                id: Math.random().toString(36).substr(2, 9),
            }])
        } else {
            // Reset form when opening fresh
            setCommonData({ manufacturer: "", product_name: "" })
            setVariants([createEmptyVariant()])
            setFile(null)
        }
    }, [initialData, open])

    const handleCommonChange = (field: keyof CommonData, value: string) => {
        setCommonData((prev) => ({ ...prev, [field]: value }))
    }

    const handleVariantChange = (id: string, field: keyof SpecVariant, value: any) => {
        setVariants((prev) => prev.map(v => v.id === id ? { ...v, [field]: value } : v))
    }

    const handleAddVariant = () => {
        setVariants((prev) => [...prev, createEmptyVariant()])
    }

    const handleRemoveVariant = (id: string) => {
        if (variants.length === 1) return // Prevent removing the last one
        setVariants((prev) => prev.filter(v => v.id !== id))
    }

    const handleCopyVariant = (variant: SpecVariant) => {
        const newVariant = { ...variant, id: Math.random().toString(36).substr(2, 9) }
        setVariants((prev) => [...prev, newVariant])
    }

    // Extra Specs Logic
    const handleExtraSpecAdd = (variantId: string, key: string) => {
        if (!key) return
        setVariants((prev) => prev.map(v => {
            if (v.id === variantId) {
                return { ...v, extra_specs: { ...v.extra_specs, [key]: 0 } }
            }
            return v
        }))
    }

    const handleExtraSpecRemove = (variantId: string, key: string) => {
        setVariants((prev) => prev.map(v => {
            if (v.id === variantId) {
                const newExtra = { ...v.extra_specs }
                delete newExtra[key]
                return { ...v, extra_specs: newExtra }
            }
            return v
        }))
    }

    const handleExtraSpecChange = (variantId: string, key: string, value: number) => {
        setVariants((prev) => prev.map(v => {
            if (v.id === variantId) {
                return { ...v, extra_specs: { ...v.extra_specs, [key]: value } }
            }
            return v
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            let fileUrl = commonData.tds_file_url

            // Upload file if selected
            if (file) {
                const supabase = createClient()
                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}.${fileExt} `
                const { data, error } = await supabase.storage
                    .from('tds-files')
                    .upload(fileName, file)

                if (error) throw error

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('tds-files')
                    .getPublicUrl(fileName)

                fileUrl = publicUrl
            }

            // Construct payload
            const specsToSave: PaperSpec[] = variants.map(v => {
                const { id, ...variantData } = v
                return {
                    ...variantData,
                    manufacturer: commonData.manufacturer,
                    product_name: commonData.product_name,
                    tds_file_url: fileUrl,
                }
            })

            // Save to DB
            const result = await saveSpecsAction(specsToSave)

            if (result.success) {
                onSuccess?.()
                onOpenChange?.(false)
            } else {
                alert("저장 실패: " + result.error)
            }
        } catch (error: any) {
            console.error(error)
            alert("오류 발생: " + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "TDS 복사/수정" : "새 TDS 등록 (멀티 스펙)"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section 1: Common Info */}
                    <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <FileText className="h-4 w-4" /> 공통 정보
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>제조사 *</Label>
                                <Input required value={commonData.manufacturer} onChange={(e) => handleCommonChange("manufacturer", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>제품명 *</Label>
                                <Input required value={commonData.product_name} onChange={(e) => handleCommonChange("product_name", e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>원본 PDF 파일</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                {commonData.tds_file_url && !file && (
                                    <span className="text-sm text-green-600 flex items-center gap-1">
                                        <FileText className="h-4 w-4" /> 기존 파일 유지됨
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Variants */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">스펙 목록 ({variants.length})</h3>
                            <Button type="button" size="sm" onClick={handleAddVariant}>
                                <Plus className="mr-2 h-4 w-4" /> 스펙 추가
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {variants.map((variant, index) => (
                                <Card key={variant.id} className="relative">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-2 text-muted-foreground hover:text-red-500"
                                        onClick={() => handleRemoveVariant(variant.id)}
                                        disabled={variants.length === 1}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-10 top-2 text-muted-foreground hover:text-blue-500"
                                        onClick={() => handleCopyVariant(variant)}
                                        title="이 스펙 복제"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>

                                    <CardContent className="pt-6 space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <Label>평량 (g/m²) *</Label>
                                                <Input type="number" required value={variant.basis_weight} onChange={(e) => handleVariantChange(variant.id, "basis_weight", Number(e.target.value))} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>두께 (µm)</Label>
                                                <Input type="number" value={variant.thickness} onChange={(e) => handleVariantChange(variant.id, "thickness", Number(e.target.value))} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>백색도 (CIE)</Label>
                                                <Input type="number" value={variant.whiteness} onChange={(e) => handleVariantChange(variant.id, "whiteness", Number(e.target.value))} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>평활도 (Bekk)</Label>
                                                <Input type="number" value={variant.smoothness} onChange={(e) => handleVariantChange(variant.id, "smoothness", Number(e.target.value))} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Cobb</Label>
                                                <Input type="number" value={variant.cobb_value} onChange={(e) => handleVariantChange(variant.id, "cobb_value", Number(e.target.value))} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>인장(MD)</Label>
                                                <Input type="number" value={variant.tensile_strength_md} onChange={(e) => handleVariantChange(variant.id, "tensile_strength_md", Number(e.target.value))} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>인장(CD)</Label>
                                                <Input type="number" value={variant.tensile_strength_cd} onChange={(e) => handleVariantChange(variant.id, "tensile_strength_cd", Number(e.target.value))} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>인열(MD)</Label>
                                                <Input type="number" value={variant.tearing_strength_md} onChange={(e) => handleVariantChange(variant.id, "tearing_strength_md", Number(e.target.value))} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>인열(CD)</Label>
                                                <Input type="number" value={variant.tearing_strength_cd} onChange={(e) => handleVariantChange(variant.id, "tearing_strength_cd", Number(e.target.value))} />
                                            </div>
                                        </div>

                                        {/* Extra Specs per Variant */}
                                        <div className="border-t pt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Label className="text-xs text-muted-foreground">추가 항목</Label>
                                                <Select onValueChange={(val) => handleExtraSpecAdd(variant.id, val)}>
                                                    <SelectTrigger className="h-7 w-[130px] text-xs">
                                                        <SelectValue placeholder="항목 추가" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {EXTRA_SPECS_OPTIONS.map((opt) => (
                                                            <SelectItem key={opt.value} value={opt.value} disabled={opt.value in (variant.extra_specs || {})}>
                                                                {opt.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {Object.entries(variant.extra_specs || {}).map(([key, value]) => {
                                                    const option = EXTRA_SPECS_OPTIONS.find(o => o.value === key)
                                                    return (
                                                        <div key={key} className="flex items-center gap-2 bg-muted/30 p-1 rounded">
                                                            <span className="text-xs flex-1 truncate" title={option?.label}>{option?.label || key}</span>
                                                            <Input
                                                                type="number"
                                                                className="h-6 w-16 text-xs px-1"
                                                                value={value as number}
                                                                onChange={(e) => handleExtraSpecChange(variant.id, key, Number(e.target.value))}
                                                            />
                                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleExtraSpecRemove(variant.id, key)}>
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>취소</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            전체 저장 ({variants.length}개)
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

