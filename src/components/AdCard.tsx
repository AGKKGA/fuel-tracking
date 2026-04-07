'use client';
import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdCardProps {
    slot: string;
    className?: string;
}

export default function AdCard({ slot, className = "" }: AdCardProps) {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    return (
        <div className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center overflow-hidden min-h-[100px] ${className}`}>
            <span className="text-[9px] uppercase tracking-widest text-zinc-600 mb-2 font-bold">Advertisement</span>
            <div className="w-full">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-1248230449403422"
                    data-ad-slot={slot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>
        </div>
    );
}
