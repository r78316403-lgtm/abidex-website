"use client";

// =====================================================================
// BOOKING FLOW CONTEXT — global state for booking modal + service detail
// ---------------------------------------------------------------------
// Any "Book Now" button anywhere on the site can call openBooking()
// optionally pre-selecting a service. The BookingFlowModal listens and
// opens automatically.
// =====================================================================

import { createContext, useContext, useState, useCallback } from "react";
import type { Service } from "@/lib/booking-data";

type BookingContextValue = {
  bookingOpen: boolean;
  initialService: Service | null;
  bookingSessionId: number;
  openBooking: (service?: Service | null) => void;
  closeBooking: () => void;

  detailService: Service | null;
  openDetail: (service: Service) => void;
  closeDetail: () => void;
};

const Ctx = createContext<BookingContextValue | null>(null);

export function BookingFlowProvider({ children }: { children: React.ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [initialService, setInitialService] = useState<Service | null>(null);
  const [detailService, setDetailService] = useState<Service | null>(null);
  // Bump this key whenever we open booking — forces the modal to remount
  // and reset its internal state cleanly.
  const [bookingSessionId, setBookingSessionId] = useState(0);

  const openBooking = useCallback((service: Service | null = null) => {
    setInitialService(service);
    setBookingSessionId((n) => n + 1);
    setBookingOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeBooking = useCallback(() => {
    setBookingOpen(false);
    setInitialService(null);
    document.body.style.overflow = "";
  }, []);

  const openDetail = useCallback((service: Service) => {
    setDetailService(service);
    document.body.style.overflow = "hidden";
  }, []);

  const closeDetail = useCallback(() => {
    setDetailService(null);
    document.body.style.overflow = "";
  }, []);

  return (
    <Ctx.Provider
      value={{
        bookingOpen,
        initialService,
        bookingSessionId,
        openBooking,
        closeBooking,
        detailService,
        openDetail,
        closeDetail,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useBookingFlow() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBookingFlow must be used inside BookingFlowProvider");
  return ctx;
}
