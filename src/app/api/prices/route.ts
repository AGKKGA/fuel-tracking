import { NextResponse } from 'next/server';
import { getEnrichedPrices } from '@/lib/data-service';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Try to get from Cache
        let cachedData;
        // The @vercel/kv client handles if KV_REST_API_URL is missing by throwing or returning null if not configured
        // We check if it is configured to avoid overhead
        if (process.env.KV_REST_API_URL) {
            try {
                cachedData = await kv.get('fuel_prices_cache');
            } catch (e) {
                console.warn("KV Access failed, bypassing cache:", e);
            }
        }

        if (cachedData) {
            return NextResponse.json({ data: cachedData, source: 'cache' });
        }

        // 2. Cache Miss: Fetch fresh
        const freshData = await getEnrichedPrices();

        // 3. Store in Cache for 5 minutes (300s)
        if (process.env.KV_REST_API_URL) {
            try {
                await kv.set('fuel_prices_cache', freshData, { ex: 300 });
            } catch (e) {
                console.warn("KV Store failed:", e);
            }
        }

        return NextResponse.json({ data: freshData, source: 'fresh' });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
    }
}
