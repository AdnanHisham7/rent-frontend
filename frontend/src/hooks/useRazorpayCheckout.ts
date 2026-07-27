import { useCallback, useRef } from "react";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface OpenCheckoutParams {
  keyId: string;
  amount: number;
  currency: string;
  orderId: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: (payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => void;
  onDismiss?: () => void;
}

export function useRazorpayCheckout() {
  const loadingRef = useRef<Promise<boolean> | null>(null);

  const openCheckout = useCallback(
    async (params: OpenCheckoutParams): Promise<boolean> => {
      if (!loadingRef.current) loadingRef.current = loadRazorpayScript();
      const loaded = await loadingRef.current;

      if (!loaded || !window.Razorpay) {
        return false;
      }

      const instance = new window.Razorpay({
        key: params.keyId,
        amount: params.amount,
        currency: params.currency,
        name: params.name,
        description: params.description,
        order_id: params.orderId,
        prefill: params.prefill,
        theme: { color: "#dc2626" },
        handler: (response) => {
          params.onSuccess({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        modal: { ondismiss: params.onDismiss },
      });
      instance.open();
      return true;
    },
    [],
  );

  return { openCheckout };
}
