import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { CheckCircle2, ShieldCheck, Wallet, Building2 } from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import {
  useCreateBookingMutation,
  useVerifyBookingPaymentMutation,
} from "@/store/api/bookingApi";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { formatCurrency } from "@/utils/format";
import type { BookingPaymentMode } from "@/types/booking";

interface BookingFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  paymentMode: BookingPaymentMode;
}

interface BookingCardProps {
  buildingId: string;
  buildingName: string;
  unitId: string;
  unitNumber: string;
  tokenAmount?: number;
}

export function BookingCard({
  buildingId,
  buildingName,
  unitId,
  unitNumber,
  tokenAmount,
}: BookingCardProps) {
  const [stage, setStage] = useState<"form" | "success">("form");
  const [successMessage, setSuccessMessage] = useState("");
  const [createBooking, { isLoading: creating }] = useCreateBookingMutation();
  const [verifyPayment, { isLoading: verifying }] =
    useVerifyBookingPaymentMutation();
  const { openCheckout } = useRazorpayCheckout();

  const canPayOnline = !!tokenAmount && tokenAmount > 0;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookingFormValues>({
    defaultValues: { paymentMode: canPayOnline ? "online" : "offline" },
  });

  const submitting = creating || verifying;

  const onSubmit = async (values: BookingFormValues) => {
    try {
      const res = await createBooking({
        buildingId,
        unitId,
        applicantName: values.name,
        applicantEmail: values.email,
        applicantPhone: values.phone || undefined,
        message: values.message || undefined,
        paymentMode: values.paymentMode,
      }).unwrap();

      const { booking, razorpayOrder } = res.data;

      if (values.paymentMode === "offline" || !razorpayOrder) {
        setSuccessMessage(
          "Your booking request has been sent. The property manager will review it and get back to you.",
        );
        setStage("success");
        return;
      }

      const opened = await openCheckout({
        keyId: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: razorpayOrder.orderId,
        name: buildingName,
        description: `Booking token for Room ${unitNumber}`,
        prefill: {
          name: values.name,
          email: values.email,
          contact: values.phone,
        },
        onSuccess: async (payload) => {
          try {
            await verifyPayment({
              bookingId: booking._id,
              razorpayOrderId: payload.razorpayOrderId,
              razorpayPaymentId: payload.razorpayPaymentId,
              razorpaySignature: payload.razorpaySignature,
            }).unwrap();
            setSuccessMessage(
              "Payment received! Your booking is now under review — paying online gives you priority.",
            );
            setStage("success");
          } catch (err: any) {
            toast.error(
              err?.data?.message ??
                "Payment verification failed. Please contact support.",
            );
          }
        },
        onDismiss: () => {
          toast.info(
            "Payment cancelled. Your request is saved — you can complete payment later from your email confirmation.",
          );
          setSuccessMessage(
            "Your booking request has been sent without payment. Paying online later increases your chances of getting this room.",
          );
          setStage("success");
        },
      });

      if (!opened) {
        toast.error("Could not load the payment window. Please try again.");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message ?? "Could not submit your booking request.",
      );
    }
  };

  if (stage === "success") {
    return (
      <Card padding="lg">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-sage-50 text-sage-500">
            <CheckCircle2 className="size-6" />
          </div>
          <h3 className="font-display text-base font-semibold text-ink">
            Request sent
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {successMessage}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <h3 className="mb-1 font-display text-base font-semibold text-ink">
        Book this room
      </h3>
      <p className="mb-4 text-xs text-ink-faint">
        Submit your details to request Room {unitNumber}.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input
          placeholder="Your name"
          {...register("name", { required: true })}
        />
        {errors.name && (
          <p className="-mt-2 text-xs text-crimson-600">Name is required.</p>
        )}

        <Input
          type="email"
          placeholder="your@email.com"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="-mt-2 text-xs text-crimson-600">Email is required.</p>
        )}

        <Input placeholder="Phone (optional)" {...register("phone")} />
        <Textarea
          placeholder={`I'm interested in room ${unitNumber}…`}
          {...register("message")}
        />

        {canPayOnline ? (
          <Controller
            control={control}
            name="paymentMode"
            render={({ field }) => (
              <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => field.onChange("online")}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition ${
                    field.value === "online"
                      ? "border-crimson-400 bg-crimson-50/60"
                      : "border-line hover:border-crimson-200"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                    <ShieldCheck className="size-3.5 text-crimson-500" /> Pay
                    online now
                  </span>
                  <span className="text-xs text-ink-soft">
                    {formatCurrency(tokenAmount!)} token · higher chance of
                    getting the room
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("offline")}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition ${
                    field.value === "offline"
                      ? "border-crimson-400 bg-crimson-50/60"
                      : "border-line hover:border-crimson-200"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                    <Building2 className="size-3.5 text-ink-soft" /> Pay at
                    property
                  </span>
                  <span className="text-xs text-ink-soft">
                    No payment now, lower priority
                  </span>
                </button>
              </div>
            )}
          />
        ) : (
          <div className="mt-1 flex items-center gap-1.5 rounded-xl border border-line bg-paper-dim px-3 py-2.5 text-xs text-ink-soft">
            <Wallet className="size-3.5" /> Online payment isn't set up for this
            room — you'll pay at the property.
          </div>
        )}

        <Button type="submit" loading={submitting} className="justify-center">
          {canPayOnline ? "Continue to book" : "Send booking request"}
        </Button>
      </form>
    </Card>
  );
}
