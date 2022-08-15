const cancelStream = (stream: MediaStream) => {
  stream.getTracks().forEach((track) => track.stop());
};

const requestPermission = async (constraints?: MediaStreamConstraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  cancelStream(stream);
};

function hasNavigator() {
  return typeof navigator !== "undefined";
}

function isMediaDevicesSupported() {
  return hasNavigator() && !!navigator.mediaDevices;
}

function canEnumerateDevices() {
  return !!(
    isMediaDevicesSupported() && navigator.mediaDevices.enumerateDevices
  );
}

export async function getMediaDevices(constraints?: MediaStreamConstraints) {
  if (!canEnumerateDevices()) throw new Error("MediaDevices not supported");
  await requestPermission(constraints);
  return await navigator.mediaDevices.enumerateDevices();
}
