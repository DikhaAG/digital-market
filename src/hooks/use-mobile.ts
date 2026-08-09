import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

/**
 * Mendaftarkan event listener ke matchMedia browser
 */
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * Mengambil status tampilan saat ini di Client Side
 */
function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/**
 * Fallback nilai default untuk Server Side Rendering (SSR)
 */
function getServerSnapshot() {
  return false;
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
