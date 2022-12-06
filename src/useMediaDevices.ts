import { useEffect, useRef, useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
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

  useEffect(() => {
    errorHandlerRef.current = onError;
  }, [onError]);

  useDeepCompareEffect(() => {
    const ac = new AbortController();

    new Promise<MediaDeviceInfo[]>((resolve, reject) => {
      ac.signal.addEventListener("abort", reject);
      getMediaDevices(constraints).then(resolve);
    })
      .then((devices) => {
        setMediaDevices(devices);
      })
      .catch((error) => {
        if (error.type === "abort") return;
        errorHandlerRef.current?.(error);
      });

    return () => {
      ac.abort();
    };
  }, [constraints]);

  return mediaDevices;
};
