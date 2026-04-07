import { FuelPrice, Region, FuelType } from './types';

export const MOCK_PRICES: Partial<FuelPrice>[] = [
    { country: "Norway", flag: "🇳🇴", region: "Europe", priceLocal: 22.50, currency: "NOK" },
    { country: "USA", flag: "🇺🇸", region: "Americas", priceLocal: 0.95, currency: "USD" },
    { country: "Germany", flag: "🇩🇪", region: "Europe", priceLocal: 1.85, currency: "EUR" },
    { country: "Japan", flag: "🇯🇵", region: "Asia", priceLocal: 175.0, currency: "JPY" },
    { country: "Nigeria", flag: "🇳🇬", region: "Africa", priceLocal: 650.0, currency: "NGN" },
    { country: "Saudi Arabia", flag: "🇸🇦", region: "Middle East", priceLocal: 2.18, currency: "SAR" },
    { country: "Australia", flag: "🇦🇺", region: "Oceania", priceLocal: 1.95, currency: "AUD" },
    { country: "Brazil", flag: "🇧🇷", region: "Americas", priceLocal: 5.80, currency: "BRL" },
    { country: "United Kingdom", flag: "🇬🇧", region: "Europe", priceLocal: 1.45, currency: "GBP" },
    { country: "France", flag: "🇫🇷", region: "Europe", priceLocal: 1.82, currency: "EUR" },
    { country: "Italy", flag: "🇮🇹", region: "Europe", priceLocal: 1.88, currency: "EUR" },
    { country: "Canada", flag: "🇨🇦", region: "Americas", priceLocal: 1.62, currency: "CAD" },
    { country: "China", flag: "🇨🇳", region: "Asia", priceLocal: 8.12, currency: "CNY" },
    { country: "India", flag: "🇮🇳", region: "Asia", priceLocal: 104.5, currency: "INR" },
    { country: "South Africa", flag: "🇿🇦", region: "Africa", priceLocal: 23.4, currency: "ZAR" },
    { country: "United Arab Emirates", flag: "🇦🇪", region: "Middle East", priceLocal: 3.12, currency: "AED" },
    { country: "Mexico", flag: "🇲🇽", region: "Americas", priceLocal: 24.5, currency: "MXN" },
    { country: "South Korea", flag: "🇰🇷", region: "Asia", priceLocal: 1650.0, currency: "KRW" },
    { country: "Switzerland", flag: "🇨🇭", region: "Europe", priceLocal: 1.92, currency: "CHF" },
    { country: "Turkey", flag: "🇹🇷", region: "Europe", priceLocal: 42.5, currency: "TRY" },
];

export async function getExchangeRates() {
    try {
        // Open.er-api.com is a reliable source for daily rates
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!res.ok) throw new Error('Failed to fetch exchange rates');
        const data = await res.json();
        return data.rates;
    } catch (e) {
        console.error("Exchange rate fetch failed, using fallbacks:", e);
        return { EUR: 0.92, NOK: 10.5, JPY: 150, NGN: 1200, SAR: 3.75, AUD: 1.5, BRL: 5.0, USD: 1, GBP: 0.79, CAD: 1.35, CNY: 7.2, INR: 83.0, ZAR: 19.0, AED: 3.67, MXN: 17.0, KRW: 1350, CHF: 0.9, TRY: 32.0 };
    }
}

export async function getEnrichedPrices(): Promise<FuelPrice[]> {
    const rates = await getExchangeRates();
    const fuelTypes: FuelType[] = ['Gasoline Regular', 'Gasoline Premium', 'Diesel'];

    const enriched: FuelPrice[] = [];

    MOCK_PRICES.forEach((base) => {
        fuelTypes.forEach((type) => {
            // Add slight variance for different fuel types
            const multiplier = type === 'Gasoline Premium' ? 1.15 : type === 'Diesel' ? 0.95 : 1;
            const localPrice = (base.priceLocal || 0) * multiplier;
            const rate = rates[base.currency || 'USD'] || 1;

            enriched.push({
                country: base.country!,
                flag: base.flag!,
                region: base.region as Region,
                fuelType: type,
                priceLocal: parseFloat(localPrice.toFixed(2)),
                currency: base.currency!,
                priceUSD: parseFloat((localPrice / rate).toFixed(2)),
                lastUpdated: new Date().toISOString(),
            });
        });
    });

    return enriched;
}
