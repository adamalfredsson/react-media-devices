import { useEffect, useState } from "react";
import { getMediaDevices } from "./utils/mediaDevices";

interface UseMediaDevicesOptions {
  constraints?: MediaStreamConstraints;
  verbose?: boolean;
}

export const useMediaDevices = ({
  constraints,
  verbose = process.env.NODE_ENV !== "production",
}: UseMediaDevicesOptions = {}) => {
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[] | null>(
    null
  );

  useEffect(() => {
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
        if (verbose) {
          console.error(error);
        }
      });

    return () => {
      ac.abort();
    };
  }, [verbose, constraints]);

  return mediaDevices;
};
