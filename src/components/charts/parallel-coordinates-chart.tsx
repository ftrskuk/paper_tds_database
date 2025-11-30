"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

// Mock data
const rawData = [
    { name: "Hi-Q 밀레니엄 아트", basis_weight: 100, thickness: 95, whiteness: 120, smoothness: 400 },
    { name: "네오스타 아트", basis_weight: 100, thickness: 92, whiteness: 118, smoothness: 380 },
    { name: "스노우 화이트", basis_weight: 120, thickness: 110, whiteness: 125, smoothness: 420 },
]

// Normalize data for parallel coordinates
// In a real app, we would calculate min/max dynamically
const normalize = (value: number, min: number, max: number) => (value - min) / (max - min)

const normalizedData = rawData.map(d => ({
    name: d.name,
    data: [
        { attribute: "평량", value: normalize(d.basis_weight, 80, 150), original: d.basis_weight },
        { attribute: "두께", value: normalize(d.thickness, 80, 150), original: d.thickness },
        { attribute: "백색도", value: normalize(d.whiteness, 100, 140), original: d.whiteness },
        { attribute: "평활도", value: normalize(d.smoothness, 200, 600), original: d.smoothness },
    ]
}))

// Recharts doesn't support Parallel Coordinates natively well.
// We can try a different approach: LineChart where X axis is categories.
// But Recharts expects array of objects where each object is an X point.
// Let's transform data:
// [
//   { attribute: "평량", "Paper A": 0.5, "Paper B": 0.6 },
//   { attribute: "두께", "Paper A": 0.4, "Paper B": 0.3 },
//   ...
// ]

const chartData = [
    { attribute: "평량", "Hi-Q 밀레니엄 아트": 0.5, "네오스타 아트": 0.6, "스노우 화이트": 0.8 },
    { attribute: "두께", "Hi-Q 밀레니엄 아트": 0.4, "네오스타 아트": 0.3, "스노우 화이트": 0.7 },
    { attribute: "백색도", "Hi-Q 밀레니엄 아트": 0.6, "네오스타 아트": 0.5, "스노우 화이트": 0.9 },
    { attribute: "평활도", "Hi-Q 밀레니엄 아트": 0.7, "네오스타 아트": 0.6, "스노우 화이트": 0.8 },
]

const colors = ["#8884d8", "#82ca9d", "#ffc658"]

export function ParallelCoordinatesChart() {
    return (
        <div className="h-full w-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="attribute" />
                    <YAxis domain={[0, 1]} tick={false} label={{ value: 'Normalized Value', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Hi-Q 밀레니엄 아트" stroke={colors[0]} strokeWidth={2} />
                    <Line type="monotone" dataKey="네오스타 아트" stroke={colors[1]} strokeWidth={2} />
                    <Line type="monotone" dataKey="스노우 화이트" stroke={colors[2]} strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
            <div className="text-center text-sm text-muted-foreground mt-4">
                * 각 항목은 0-1로 정규화된 값입니다.
            </div>
        </div>
    )
}
