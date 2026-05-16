"use client";

import { useEffect, useRef } from "react";

export default function GoogleAd() {
  const adRef = useRef(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.adsbygoogle &&
      adRef.current &&
      !adRef.current.getAttribute("data-adsbygoogle-status")
    ) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8679343813839428"
      data-ad-slot="4582405110"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
