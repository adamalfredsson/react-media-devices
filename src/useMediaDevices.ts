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
    null
  );
  const errorHandlerRef = useRef<UseMediaDevicesOptions["onError"] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    errorHandlerRef.current = onError;
  }, [onError]);

  useDeepCompareEffectNoCheck(() => {
    const ac = new AbortController();

    new Promise<MediaDeviceInfo[]>((resolve, reject) => {
      ac.signal.addEventListener("abort", reject);
      setLoading(true);
      getMediaDevices(constraints)
        .then(resolve)
        .catch((error) => {
          errorHandlerRef.current?.(error);
        });
    })
      .then((devices) => {
        setMediaDevices(devices);
      })
      .catch((error) => {
        if (error.type === "abort") return;
        errorHandlerRef.current?.(error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      ac.abort();
    };
  }, [constraints]);

  return { devices: mediaDevices, loading };
};
