"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"

export default function AdminPage() {
    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">데이터 관리</h1>
            </div>

            <Tabs defaultValue="upload" className="w-full">
                <TabsList>
                    <TabsTrigger value="upload">PDF 업로드</TabsTrigger>
                    <TabsTrigger value="drafts">검토 대기 (3)</TabsTrigger>
                    <TabsTrigger value="approved">승인됨</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>새로운 TDS 등록</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 hover:bg-muted/50 transition-colors cursor-pointer">
                                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">PDF 파일을 이곳에 드래그하세요</h3>
                                <p className="text-sm text-muted-foreground mb-4">또는 클릭하여 파일 선택</p>
                                <Button>파일 선택</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="drafts" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>검토 대기 목록</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <FileText className="h-8 w-8 text-blue-500" />
                                            <div>
                                                <p className="font-medium">Paper_Spec_2024_{i}.pdf</p>
                                                <p className="text-sm text-muted-foreground">2024-11-30 업로드됨</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">검토</Button>
                                            <Button size="sm">승인</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
