import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Tag, Trash2, Percent, IndianRupee } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonRow } from "@/components/ui/Skeleton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  useGetOffersQuery,
  useCreateOfferMutation,
  useDeleteOfferMutation,
} from "@/store/api/offerApi";
import { useGetBuildingsQuery } from "@/store/api/buildingApi";
import { useGetUnitsQuery } from "@/store/api/unitApi";
import { formatCurrency, formatDate } from "@/utils/format";
import type { OfferDiscountType } from "@/types/offer";

interface FormValues {
  buildingId: string;
  unitId: string;
  title: string;
  description: string;
  discountType: OfferDiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
}

const todayStr = () => new Date().toISOString().split("T")[0];
const inDays = (n: number) =>
  new Date(Date.now() + n * 86400000).toISOString().split("T")[0];

export default function OffersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data, isLoading } = useGetOffersQuery();
  const { data: buildingsData } = useGetBuildingsQuery();
  const [createOffer, { isLoading: creating }] = useCreateOfferMutation();
  const [deleteOffer, { isLoading: deleting }] = useDeleteOfferMutation();

  const { register, handleSubmit, reset, control, watch } = useForm<FormValues>(
    {
      defaultValues: {
        discountType: "percentage",
        startDate: todayStr(),
        endDate: inDays(14),
      },
    },
  );
  const selectedBuildingId = watch("buildingId");
  const discountType = watch("discountType");
  const discountValue = watch("discountValue");

  const { data: unitsData } = useGetUnitsQuery(
    selectedBuildingId ? { buildingId: selectedBuildingId } : undefined,
    { skip: !selectedBuildingId },
  );
  const selectedUnitId = watch("unitId");
  const selectedUnit = unitsData?.data.find((u) => u._id === selectedUnitId);

  const offers = data?.data ?? [];
  const buildingNames = new Map(
    (buildingsData?.data ?? []).map((b) => [b._id, b.name]),
  );

  const previewRent = selectedUnit
    ? discountType === "percentage"
      ? Math.round(selectedUnit.rentAmount * (1 - (discountValue || 0) / 100))
      : Math.max(0, selectedUnit.rentAmount - (discountValue || 0))
    : null;

  const onSubmit = async (values: FormValues) => {
    try {
      await createOffer({
        buildingId: values.buildingId,
        unitId: values.unitId,
        title: values.title,
        description: values.description || undefined,
        discountType: values.discountType,
        discountValue: Number(values.discountValue),
        startDate: values.startDate,
        endDate: values.endDate,
      }).unwrap();
      toast.success(
        "Offer created — it will replace any existing offer on this room.",
      );
      reset({
        discountType: "percentage",
        startDate: todayStr(),
        endDate: inDays(14),
      });
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Could not create offer.");
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteOffer(deleteTarget).unwrap();
      toast.success("Offer removed.");
      setDeleteTarget(null);
    } catch {
      toast.error("Could not delete offer.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Offers
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Apply discounts to rooms — they show live on your public listing.
          </p>
        </div>
        <Button
          icon={<Plus className="size-4" />}
          onClick={() => setModalOpen(true)}
        >
          New offer
        </Button>
      </div>

      <Card padding="none">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
        {!isLoading && !offers.length && (
          <EmptyState
            icon={<Tag className="size-6" />}
            title="No offers yet"
            description="Create a discount on a room to attract more applicants."
            action={
              <Button
                icon={<Plus className="size-4" />}
                onClick={() => setModalOpen(true)}
              >
                Create first offer
              </Button>
            }
          />
        )}
        <div className="divide-y divide-line">
          {offers.map((o) => (
            <div
              key={o._id}
              className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {o.title}
                </p>
                <p className="text-xs text-ink-faint">
                  {buildingNames.get(o.buildingId) ?? "Building"} ·{" "}
                  {o.discountType === "percentage"
                    ? `${o.discountValue}% off`
                    : `${formatCurrency(o.discountValue)} off`}{" "}
                  · until {formatDate(o.endDate)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StatusPill
                  status={
                    o.isActive && new Date(o.endDate) >= new Date()
                      ? "active"
                      : "inactive"
                  }
                />
                <button
                  onClick={() => setDeleteTarget(o._id)}
                  className="text-crimson-400 hover:text-crimson-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create an offer"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Select
            label="Building"
            placeholder="Select building"
            options={(buildingsData?.data ?? []).map((b) => ({
              value: b._id,
              label: b.name,
            }))}
            {...register("buildingId", { required: true })}
          />
          <Select
            label="Room"
            placeholder={
              selectedBuildingId ? "Select room" : "Select a building first"
            }
            disabled={!selectedBuildingId}
            options={(unitsData?.data ?? []).map((u) => ({
              value: u._id,
              label: `${u.unitNumber} — ${formatCurrency(u.rentAmount)}/mo`,
            }))}
            {...register("unitId", { required: true })}
          />
          <Input
            label="Offer title"
            placeholder="e.g. Festive Season Discount"
            {...register("title", { required: true })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={control}
              name="discountType"
              render={({ field }) => (
                <Select
                  label="Discount type"
                  options={[
                    { value: "percentage", label: "Percentage" },
                    { value: "flat", label: "Flat amount" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Input
              label={
                discountType === "percentage" ? "Discount (%)" : "Discount (₹)"
              }
              type="number"
              step={discountType === "percentage" ? 1 : 100}
              leftIcon={
                discountType === "percentage" ? (
                  <Percent className="size-3.5" />
                ) : (
                  <IndianRupee className="size-3.5" />
                )
              }
              {...register("discountValue", {
                required: true,
                valueAsNumber: true,
              })}
            />
          </div>

          {selectedUnit && previewRent !== null && (
            <div className="rounded-xl border border-line bg-paper-dim px-3 py-2.5 text-xs text-ink-soft">
              New effective rent:{" "}
              <span className="font-semibold text-crimson-600">
                {formatCurrency(previewRent)}
              </span>{" "}
              <span className="text-ink-faint line-through">
                {formatCurrency(selectedUnit.rentAmount)}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start date"
              type="date"
              {...register("startDate", { required: true })}
            />
            <Input
              label="End date"
              type="date"
              {...register("endDate", { required: true })}
            />
          </div>

          <Button type="submit" loading={creating} className="justify-center">
            Create offer
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Remove this offer?"
        description="The room will go back to its regular price on the public listing."
        confirmLabel="Remove"
        loading={deleting}
      />
    </div>
  );
}
