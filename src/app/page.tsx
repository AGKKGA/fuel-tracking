'use client';
import { useState, useEffect, useMemo } from 'react';
import TopBar from '@/components/TopBar';
import GeekMode from '@/components/GeekMode';
import AdCard from '@/components/AdCard';
import { FuelPrice, Region, FuelType } from '@/lib/types';
import { ChevronUp, ChevronDown, BarChart2, Filter, Search, Globe } from 'lucide-react';

export default function Dashboard() {
  const [prices, setPrices] = useState<FuelPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filterRegion, setFilterRegion] = useState<Region | 'All'>('All');
  const [filterType, setFilterType] = useState<FuelType>('Gasoline Regular');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof FuelPrice, dir: 'asc' | 'desc' }>({ key: 'priceUSD', dir: 'asc' });
  const [showGeekMode, setShowGeekMode] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/prices');
      if (!res.ok) throw new Error('Fetch failed');
      const json = await res.json();
      setPrices(json.data);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = useMemo(() => {
    return prices
      .filter(p => {
        const matchesRegion = filterRegion === 'All' || p.region === filterRegion;
        const matchesType = p.fuelType === filterType;
        const matchesSearch = p.country.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRegion && matchesType && matchesSearch;
      })
      .sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortConfig.dir === 'asc' ? ((valA as number) > (valB as number) ? 1 : -1) : ((valA as number) < (valB as number) ? 1 : -1);
      });
  }, [prices, filterRegion, filterType, searchQuery, sortConfig]);

  const toggleSort = (key: keyof FuelPrice) => {
    setSortConfig(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 font-sans selection:bg-blue-500/30">
      <TopBar onRefresh={fetchData} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Stats / Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Global Price Index</h2>
            <p className="text-zinc-500 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Live market tracking across {new Set(prices.map(p => p.country)).size} countries
            </p>
          </div>

          {error && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 rounded-lg text-sm flex items-center gap-2 animate-pulse">
              Serving cached/stale data due to source connectivity issues.
            </div>
          )}
        </div>

        {/* Ad Slot */}
        <AdCard slot="1234567890" className="mb-8" />

        {/* Filters Panel */}
        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 flex-1 min-w-[300px]">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search country..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 ring-blue-500/50 transition shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Fuel Type Filter */}
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 shadow-inner">
              {(['Gasoline Regular', 'Gasoline Premium', 'Diesel'] as FuelType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${filterType === type ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {type.split(' ')[1] || type}
                </button>
              ))}
            </div>

            {/* Region Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <select
                className="bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 ring-blue-500/50 appearance-none min-w-[140px] shadow-inner"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value as Region | 'All')}
              >
                <option value="All">All Regions</option>
                <option>Europe</option>
                <option>Americas</option>
                <option>Asia</option>
                <option>Middle East</option>
                <option>Africa</option>
                <option>Oceania</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowGeekMode(!showGeekMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${showGeekMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'}`}
          >
            <BarChart2 className="w-4 h-4" />
            Geek Mode {showGeekMode ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Geek Mode Charts */}
        {showGeekMode && <GeekMode prices={prices.filter(p => p.fuelType === filterType)} />}

        {/* Table Container */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-hidden">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-500 text-[10px] uppercase tracking-[0.1em] font-bold">
                  <th className="px-8 py-5 cursor-pointer hover:text-white transition" onClick={() => toggleSort('country')}>
                    <div className="flex items-center gap-1">
                      Country {sortConfig.key === 'country' && (sortConfig.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="px-6 py-5">System</th>
                  <th className="px-6 py-5 cursor-pointer hover:text-white transition" onClick={() => toggleSort('priceLocal')}>
                    <div className="flex items-center gap-1">
                      Local Price {sortConfig.key === 'priceLocal' && (sortConfig.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="px-6 py-5 cursor-pointer hover:text-white transition" onClick={() => toggleSort('priceUSD')}>
                    <div className="flex items-center gap-1 text-zinc-300">
                      Price (USD/L) {sortConfig.key === 'priceUSD' && (sortConfig.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-6 h-16">
                        <div className="h-4 bg-zinc-800 rounded w-full opacity-50"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-600/5 transition-colors group">
                      <td className="px-8 py-5 flex items-center gap-4">
                        <span className="text-2xl drop-shadow-sm grayscale-[0.2] group-hover:grayscale-0 transition-all">{row.flag}</span>
                        <span className="font-semibold text-zinc-100">{row.country}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                          {row.fuelType.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-mono text-sm text-zinc-400">
                        {row.priceLocal} <span className="text-[10px] text-zinc-600 font-sans tracking-tight">{row.currency}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-baseline gap-1">
                          <span className={`font-mono text-lg font-bold ${row.priceUSD > 1.8 ? 'text-red-400' : row.priceUSD < 1.0 ? 'text-emerald-400' : 'text-blue-400'}`}>
                            ${row.priceUSD.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right sm:text-left">
                        <span className="inline-flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          Live
                        </span>
                      </td>
                    </tr>
                  ))
                )}
                {!loading && filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-zinc-500">
                      No results found for your search/filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-zinc-600 text-xs">
          Data provided by FuelWatch Global Index. Updates every 5 minutes.
          Prices are approximate and subject to market volatility.
        </p>
      </div>
    </main>
  );
}
