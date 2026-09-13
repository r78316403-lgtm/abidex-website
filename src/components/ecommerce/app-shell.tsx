"use client";

// =====================================================================
// APP SHELL — client-side router that dispatches based on hash route
// ---------------------------------------------------------------------
// During SSR the hash is unavailable, so we render a skeleton.
// After client hydration the router kicks in and renders the right
// page. We use useSyncExternalStore to detect client mount without
// the setState-in-effect antipattern.
// =====================================================================

import { useRouter } from "@/lib/router";
import { Suspense, useSyncExternalStore } from "react";
import { PageSkeleton } from "./page-skeleton";

type Routes = Record<string, React.ReactNode>;

// Empty subscription — we just want a one-time check on whether we're
// on the client (true) or still on the server (false).
const emptySubscribe = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export function AppShell({ routes, fallback }: { routes: Routes; fallback: React.ReactNode }) {
  const { route } = useRouter();
  // Returns false during SSR, true on the client. Triggers a re-render
  // on hydration without setState-in-effect.
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  if (!mounted) return <PageSkeleton />;

  const first = route.segments[0] ?? "";
  if (!first) {
    return <Suspense fallback={<PageSkeleton />}>{routes["/"]}</Suspense>;
  }
  const key = `/${first}`;
  const match = routes[key];
  if (match) {
    return <Suspense fallback={<PageSkeleton />}>{match}</Suspense>;
  }
  return <Suspense fallback={<PageSkeleton />}>{fallback}</Suspense>;
}
