import { useEffect, useRef, useState } from "react";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import { getMediaDevices } from "./utils/mediaDevices";

interface UseMediaDevicesOptions {
  constraints?: MediaStreamConstraints;
  onError?: (error: Error) => void;
}

export const useMediaDevices = ({
  constraints,
  onError = () => {},
}: UseMediaDevicesOptions = {}) => {
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[] | null>(
    null,
  );
  const errorHandlerRef = useRef<UseMediaDevicesOptions["onError"] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    errorHandlerRef.current = onError;
  }, [onError]);

  useDeepCompareEffectNoCheck(() => {
    const ac = new AbortController();

    async function fetchMediaDevices() {
      try {
        setLoading(true);
        const devices = await Promise.race([
          getMediaDevices(constraints),
          new Promise<null>((resolve) => {
            ac.signal.addEventListener("abort", () => {
              resolve(null);
            });
          }),
        ]);
        if (devices === null) return;
        setMediaDevices(devices);
      } catch (error) {
        errorHandlerRef.current?.(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMediaDevices();

    return () => {
      ac.abort();
    };
  }, [constraints]);

  return { devices: mediaDevices, loading };
};
