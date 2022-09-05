import { useState } from "react";
import { useMediaDevices } from "react-media-devices";

const App = () => {
  const [selectedConstraints, setSelectedConstraints] =
    useState<MediaStreamConstraints>({
      audio: true,
      video: false,
    });
  const devices = useMediaDevices({
    constraints: selectedConstraints,
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div>
      <h1>react-media-devices example</h1>
      <form>
        <label>
          Audio
          <input
            type="checkbox"
            checked={!!selectedConstraints.audio}
            onChange={(e) =>
              setSelectedConstraints({
                ...selectedConstraints,
                audio: e.target.checked,
              })
            }
          />
        </label>
        <label>
          Video
          <input
            type="checkbox"
            checked={!!selectedConstraints.video}
            onChange={(e) =>
              setSelectedConstraints({
                ...selectedConstraints,
                video: e.target.checked,
              })
            }
          />
        </label>
      </form>
      <ul>
        {devices?.map((device, index) => (
          <li key={index}>
            <strong>Label: {device.label || "undefined"}</strong>
            <br />
            <small>Device id: {device.deviceId}</small>
            <br />
            <small>Group id: {device.groupId}</small>
            <br />
            <small>Kind: {device.kind}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
