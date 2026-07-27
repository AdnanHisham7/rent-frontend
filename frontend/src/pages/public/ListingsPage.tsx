import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Search, Building2, SlidersHorizontal, DoorOpen, LocateFixed, X } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { useGetPublicBuildingsQuery, useGetPublicFiltersQuery, useLazyGetNearbyBuildingsQuery } from '@/store/api/publicApi';
import { formatCurrency } from '@/utils/format';
import type { PublicBuildingCard, PublicNearbyBuilding } from '@/types/platform';

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'rent_low', label: 'Rent: Low to high' },
  { value: 'rent_high', label: 'Rent: High to low' },
];

function BuildingCard({ b, index, distanceKm }: { b: PublicBuildingCard; index: number; distanceKm?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
      <Link to={`/listings/${b.slug}`}>
        <Card hover padding="none" className="overflow-hidden h-full">
          <div className="relative h-40 bg-gradient-to-br from-crimson-100 to-paper-deep">
            {b.images?.[0] ? <img src={b.images[0]} alt={b.name} className="size-full object-cover" /> : <div className="flex size-full items-center justify-center text-crimson-200"><Building2 className="size-10" /></div>}
            {b.availableUnitsCount > 0 ? (
              <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10.5px] font-semibold text-sage-600">{b.availableUnitsCount} avail.</span>
            ) : (
              <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10.5px] font-semibold text-crimson-600">Full</span>
            )}
            {distanceKm !== undefined && (
              <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10.5px] font-semibold text-ink">
                <LocateFixed className="size-3" /> {distanceKm} km
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col p-4">
            <h3 className="font-display text-sm font-semibold leading-tight text-ink">{b.name}</h3>
            <p className="mt-0.5 text-xs text-ink-faint">{b.location.city}, {b.location.state}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-ink-soft">
              <DoorOpen className="size-3.5 text-crimson-400" /> {b.totalUnits} rooms · {b.totalFloors} floors
            </div>
            {b.minRent !== null && (
              <p className="mt-auto pt-2 text-sm font-semibold text-crimson-600">From {formatCurrency(b.minRent)}/mo</p>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function ListingsPage() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState<'newest' | 'rent_low' | 'rent_high'>('newest');
  const [page, setPage] = useState(1);
  const [nearbyMode, setNearbyMode] = useState(false);
  const [locating, setLocating] = useState(false);
  const [nearbyResults, setNearbyResults] = useState<PublicNearbyBuilding[] | null>(null);

  const { data, isLoading } = useGetPublicBuildingsQuery(
    { search: search || undefined, city: city || undefined, type: type || undefined, sort, page, limit: 12 },
    { skip: nearbyMode },
  );
  const { data: filtersData } = useGetPublicFiltersQuery();
  const [fetchNearby, { isFetching: nearbyLoading }] = useLazyGetNearbyBuildingsQuery();

  const cities = filtersData?.data.cities ?? [];
  const types = filtersData?.data.types ?? [];

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      toast.error("Your browser doesn't support location detection.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocating(false);
        try {
          const res = await fetchNearby({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radiusKm: 15,
            limit: 20,
          }).unwrap();
          setNearbyResults(res.data);
          setNearbyMode(true);
          if (!res.data.length) {
            toast.info('No spaces found within 15 km of your location.');
          }
        } catch {
          toast.error('Could not fetch nearby listings. Please try again.');
        }
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error('Location access denied. Enable it in your browser settings to find nearby spaces.');
        } else {
          toast.error('Could not detect your location. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const exitNearbyMode = () => {
    setNearbyMode(false);
    setNearbyResults(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Browse spaces</h1>
          <p className="mt-1.5 text-sm text-ink-soft">
            {nearbyMode ? `${nearbyResults?.length ?? 0} spaces near you` : `${data?.total ?? 0} properties available`}
          </p>
        </div>
        {!nearbyMode ? (
          <Button variant="outline" icon={<LocateFixed className="size-4" />} loading={locating || nearbyLoading} onClick={handleFindNearby}>
            Near me
          </Button>
        ) : (
          <Button variant="ghost" icon={<X className="size-4" />} onClick={exitNearbyMode}>
            Exit nearby search
          </Button>
        )}
      </div>

      {!nearbyMode && (
        <div className="mb-6 flex flex-wrap gap-3">
          <Input placeholder="Search buildings…" leftIcon={<Search className="size-4" />} value={search} onChange={e => setSearch(e.target.value)} className="flex-1 min-w-[180px] max-w-xs" />
          {cities.length > 0 && <Select value={city} onChange={e => setCity(e.target.value)} options={[{ value: '', label: 'All cities' }, ...cities.map(c => ({ value: c, label: c }))]} className="w-40" />}
          {types.length > 0 && <Select value={type} onChange={e => setType(e.target.value)} options={[{ value: '', label: 'All types' }, ...types.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))]} className="w-40" />}
          <Select value={sort} onChange={e => setSort(e.target.value as any)} options={sortOptions} className="w-48" />
        </div>
      )}

      {(isLoading && !nearbyMode) && <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><br/>{Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}</div>}
      {(nearbyMode && nearbyLoading) && <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>}

      {!nearbyMode && !isLoading && !data?.data.length && (
        <EmptyState icon={<SlidersHorizontal className="size-6" />} title="No listings match your filters" description="Try clearing some filters or broadening your search." action={<Button variant="outline" onClick={() => { setSearch(''); setCity(''); setType(''); }}>Clear filters</Button>} />
      )}

      {nearbyMode && !nearbyLoading && !nearbyResults?.length && (
        <EmptyState icon={<LocateFixed className="size-6" />} title="Nothing nearby yet" description="No published spaces were found within 15 km of your location." action={<Button variant="outline" onClick={exitNearbyMode}>Back to all listings</Button>} />
      )}

      {!nearbyMode && !isLoading && !!data?.data.length && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.data.map((b, i) => <BuildingCard key={b.slug ?? b._id} b={b} index={i} />)}
        </div>
      )}

      {nearbyMode && !nearbyLoading && !!nearbyResults?.length && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {nearbyResults.map((b, i) => <BuildingCard key={b.slug ?? b._id} b={b} index={i} distanceKm={b.distanceKm} />)}
        </div>
      )}

      {!nearbyMode && data && data.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination page={page} totalPages={data.totalPages} onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </div>
      )}
    </div>
  );
}
