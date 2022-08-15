<div align="center">
  <h1>
    <br/>
    <br/>
    📷
    <br />
    react-media-devices
    <br />
    <br />
  </h1>
  <br />
  <pre>npm i <a href="https://www.npmjs.com/package/react-media-devices">react-media-devices</a></pre>
  <br />
</div>

Exports a handy `useMediaDevices` hook that utilizes the MediaDevice API to detect available media devices.

## Usage

```jsx
import React from "react";
import { useMediaDevices } from "react-media-devices";

const App = () => {
  const { devices } = useMediaDevices();

  return (
    <div>
      <h1>Devices</h1>
      <ul>
        {devices?.map((device) => (
          <li key={device.id}>{device.label}</li>
        ))}
      </ul>
    </div>
  );
};
```
