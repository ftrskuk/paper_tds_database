"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function FilterSidebar() {
    return (
        <div className="w-64 flex-shrink-0 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>필터</CardTitle>
                    <CardDescription>조건에 맞는 종이를 검색하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>제조사</Label>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="m1" />
                                <label htmlFor="m1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    한솔제지
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="m2" />
                                <label htmlFor="m2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    무림페이퍼
                                </label>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>평량 (g/m²)</Label>
                                <span className="text-xs text-muted-foreground">0 - 300</span>
                            </div>
                            <Slider defaultValue={[0, 300]} max={300} step={1} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>백색도 (CIE)</Label>
                                <span className="text-xs text-muted-foreground">0 - 180</span>
                            </div>
                            <Slider defaultValue={[0, 180]} max={180} step={1} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>두께 (μm)</Label>
                                <span className="text-xs text-muted-foreground">0 - 500</span>
                            </div>
                            <Slider defaultValue={[0, 500]} max={500} step={1} />
                        </div>
                    </div>

                    <Button className="w-full">필터 적용</Button>
                </CardContent>
            </Card>
        </div>
    )
}
