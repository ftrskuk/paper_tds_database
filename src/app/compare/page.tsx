"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ParallelCoordinatesChart } from "@/components/charts/parallel-coordinates-chart"
import { ComparisonBarChart } from "@/components/charts/comparison-bar-chart"
import { ScatterPlot } from "@/components/charts/scatter-plot"

export default function ComparePage() {
    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">비교 분석</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline">내보내기</Button>
                </div>
            </div>

            <Tabs defaultValue="parallel" className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="parallel">다차원 분석 (Parallel)</TabsTrigger>
                        <TabsTrigger value="bar">항목별 비교 (Bar)</TabsTrigger>
                        <TabsTrigger value="scatter">상관관계 분석 (Scatter)</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 border rounded-lg p-6 bg-card">
                    <TabsContent value="parallel" className="h-full mt-0">
                        <ParallelCoordinatesChart />
                    </TabsContent>
                    <TabsContent value="bar" className="h-full mt-0">
                        <ComparisonBarChart />
                    </TabsContent>
                    <TabsContent value="scatter" className="h-full mt-0">
                        <ScatterPlot />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
