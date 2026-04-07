'use client';
import { useEffect, useState } from 'react';
import { RefreshCcw, Fuel } from 'lucide-react';

export default function TopBar({ onRefresh }: { onRefresh: () => void }) {
    const [seconds, setSeconds] = useState(300);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    onRefresh();
                    return 300;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [onRefresh]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                        <Fuel className="text-white w-5 h-5" />
                    </div>
                    <h1 className="font-bold text-xl tracking-tighter">
                        FUEL<span className="text-blue-500">WATCH</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                    <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-1.5 rounded-full border border-zinc-800 hover:border-zinc-700 transition">
                        <RefreshCcw className={`w-3 h-3 ${seconds < 10 || seconds === 300 ? 'animate-spin text-blue-500' : ''}`} />
                        <span className="hidden sm:inline">REFRESH IN </span>
                        <span className="text-zinc-100 font-bold w-10 text-center">{formatTime(seconds)}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
