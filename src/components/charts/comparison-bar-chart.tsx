"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const data = [
    { name: "Hi-Q 밀레니엄 아트", whiteness: 120, opacity: 95 },
    { name: "네오스타 아트", whiteness: 118, opacity: 94 },
    { name: "스노우 화이트", whiteness: 125, opacity: 96 },
]

export function ComparisonBarChart() {
    return (
        <div className="h-full w-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="whiteness" name="백색도" fill="#8884d8" />
                    <Bar dataKey="opacity" name="불투명도" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
