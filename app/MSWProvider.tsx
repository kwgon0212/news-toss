"use client";

import { useEffect, useState } from "react";

export const MSWProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined") {
        const { worker } = await import("@/mocks/browser");
        await worker.start({
          onUnhandledRequest: "bypass",
        });
        setIsReady(true);
      }
    };

    if (!isReady) init();
  }, [isReady]);

  if (!isReady) return null;
  return <>{children}</>;
};
