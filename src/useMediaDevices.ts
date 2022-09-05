import { useEffect, useState } from "react";
import { useEvent } from "./useEvent";
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

  const handleError = useEvent(onError);

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
        handleError(error);
      });

    return () => {
      ac.abort();
    };
  }, [constraints, handleError]);

  return mediaDevices;
};
