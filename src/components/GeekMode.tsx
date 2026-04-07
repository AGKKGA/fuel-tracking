'use client';
import { useMemo } from 'react';
import { FuelPrice } from '@/lib/types';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

interface GeekModeProps {
    prices: FuelPrice[];
}

export default function GeekMode({ prices }: GeekModeProps) {
    // 1. Top 10 Most Expensive (Bar Chart)
    const top10 = useMemo(() => {
        return [...prices]
            .sort((a, b) => b.priceUSD - a.priceUSD)
            .slice(0, 10)
            .map(p => ({
                name: p.country,
                price: p.priceUSD
            }));
    }, [prices]);

    // 2. Regional Averages (Radar Chart)
    const regionalAverages = useMemo(() => {
        const regions = Array.from(new Set(prices.map(p => p.region)));
        return regions.map(region => {
            const regionPrices = prices.filter(p => p.region === region);
            const avg = regionPrices.reduce((sum, p) => sum + p.priceUSD, 0) / regionPrices.length;
            return {
                region,
                average: parseFloat(avg.toFixed(2))
            };
        });
    }, [prices]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Bar Chart Card */}
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-80 flex flex-col">
                <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Top 10 Prices (USD/L)</h3>
                <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={top10} layout="vertical" margin={{ left: 20, right: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                            <XAxis type="number" stroke="#71717a" fontSize={10} tickFormatter={(v) => `$${v}`} />
                            <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={10} width={80} />
                            <Tooltip
                                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                itemStyle={{ color: '#3b82f6' }}
                            />
                            <Bar dataKey="price" radius={[0, 4, 4, 0]}>
                                {top10.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#3b82f6'} fillOpacity={0.8 - (index * 0.05)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Radar Chart Card */}
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-80 flex flex-col">
                <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Regional Averages</h3>
                <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={regionalAverages}>
                            <PolarGrid stroke="#27272a" />
                            <PolarAngleAxis dataKey="region" stroke="#71717a" fontSize={10} />
                            <PolarRadiusAxis stroke="#27272a" fontSize={8} />
                            <Radar
                                name="Avg Price"
                                dataKey="average"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.4}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                itemStyle={{ color: '#3b82f6' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
