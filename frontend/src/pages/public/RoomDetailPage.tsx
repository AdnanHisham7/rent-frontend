import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, BedDouble, Bath, MapPin, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Avatar';
import { useGetPublicUnitDetailQuery } from '@/store/api/publicApi';
import { BookingCard } from '@/components/public/BookingCard';
import { formatCurrency, ordinalFloorName } from '@/utils/format';

export default function RoomDetailPage() {
  const { buildingId, unitId } = useParams<{ buildingId: string; unitId: string }>();
  const { data, isLoading } = useGetPublicUnitDetailQuery(unitId!, { skip: !unitId });

  if (isLoading) return <PageLoader />;
  if (!data?.data) return <div className="p-8 text-center text-ink-soft">Room not found.</div>;
  const u = data.data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link to={`/listings/${buildingId}`} className="mb-5 flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
        <ChevronLeft className="size-4" /> {u.building.name}
      </Link>

      {u.images?.[0] && (
        <div className="mb-6 grid grid-cols-3 gap-2 overflow-hidden rounded-2xl">
          <div className="col-span-2 h-56 overflow-hidden rounded-xl"><img src={u.images[0]} alt="" className="size-full object-cover" /></div>
          {u.images[1] && <div className="h-56 overflow-hidden rounded-xl"><img src={u.images[1]} alt="" className="size-full object-cover" /></div>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-semibold text-ink">Room {u.unitNumber}</span>
              <StatusPill status={u.status} />
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft"><MapPin className="size-3.5" /> {u.building.name} · {ordinalFloorName(parseInt(u.floorNumber))}</p>
            {u.activeOffer ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-sage-50 px-2.5 py-1 text-xs font-semibold text-sage-600">
                  <Tag className="size-3" /> {u.activeOffer.title}
                </span>
                <span className="font-display text-2xl font-semibold text-crimson-600">
                  {formatCurrency(u.effectiveRent)}<span className="text-sm font-normal text-ink-soft">/mo</span>
                </span>
                <span className="text-sm text-ink-faint line-through">{formatCurrency(u.rentAmount)}</span>
              </div>
            ) : (
              <p className="mt-3 font-display text-2xl font-semibold text-crimson-600">
                {formatCurrency(u.rentAmount)}<span className="text-sm font-normal text-ink-soft">/mo</span>
              </p>
            )}
            <div className="mt-3 flex gap-5 text-sm text-ink-soft">
              <span className="flex items-center gap-1.5"><BedDouble className="size-4" /> {u.bedrooms} bedrooms</span>
              <span className="flex items-center gap-1.5"><Bath className="size-4" /> {u.bathrooms} bathrooms</span>
            </div>
            {u.description && <p className="mt-4 text-sm leading-relaxed text-ink-soft">{u.description}</p>}
          </div>

          {u.amenities?.length ? (
            <Card padding="md">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink-faint">Room amenities</p>
              <div className="flex flex-wrap gap-1.5">
                {u.amenities.map(a => <span key={a} className="rounded-full bg-paper-dim px-2.5 py-1 text-xs font-medium text-ink-soft">{a}</span>)}
              </div>
            </Card>
          ) : null}
        </div>

        <BookingCard
          buildingId={u.building._id}
          buildingName={u.building.name}
          unitId={u._id}
          unitNumber={u.unitNumber}
          tokenAmount={u.tokenAmount}
        />
      </div>
    </div>
  );
}
