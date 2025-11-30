"use client"

import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const data = [
    { x: 100, y: 200, z: 200, name: "Hi-Q 밀레니엄 아트" },
    { x: 120, y: 100, z: 260, name: "네오스타 아트" },
    { x: 170, y: 300, z: 400, name: "스노우 화이트" },
]

export function ScatterPlot() {
    return (
        <div className="h-full w-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="평량" unit="g/m²" />
                    <YAxis type="number" dataKey="y" name="두께" unit="μm" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Papers" data={data} fill="#8884d8" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}
