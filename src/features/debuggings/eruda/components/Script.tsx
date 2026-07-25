"use client";

import { useEffect } from "react";

export default function ErudaScript() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/eruda";
      script.onload = () => {
        // @ts-ignore
        if (window.eruda) window.eruda.init();
      };
      document.body.appendChild(script);
    }
  }, []);
  return;
}
