import React, { useState } from "react";
import Switch from "./Switch";
import Wrapper from "./Wrapper";

const ServiceApp = () => {
  const [apacheRunning, setApacheRunning] = useState(false);
  const [mysqlRunning, setMysqlRunning] = useState(false);
  const [status, setStatus] = useState("");

  const controlService = (service, action) => {
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.send("control-service", service, action);
      window.electron.ipcRenderer.on("service-status", (event, message) => {
        setStatus(message);
      });
      setStatus(`${action.charAt(0).toUpperCase() + action.slice(1)}ing ${service.charAt(0).toUpperCase() + service.slice(1)}...`);
    } else {
      console.error("Electron API is not available");
    }
  };


  return (
    <Wrapper title={"Apache & MySQL Server Control"}>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center p-4 bg-neutral-800 rounded-lg shadow">
          <h2 className="text-xl mb-2">Apache</h2>
          <Switch
            checked={apacheRunning}
            onChange={(e) => {
              const checked = e.target.checked;
              setApacheRunning(checked);
              controlService("apache2", checked ? "start" : "stop");
            }}
          />
          <p className="mt-2">{apacheRunning ? "Running" : "Stopped"}</p>
        </div>

        <div className="flex flex-col items-center p-4 bg-neutral-800 rounded-lg shadow">
          <h2 className="text-xl mb-2">MySQL</h2>
          <Switch
            checked={mysqlRunning}
            onChange={(e) => {
              const checked = e.target.checked;
              setMysqlRunning(checked);
              controlService("mysql", checked ? "start" : "stop");
            }}
          />
          <p className="mt-2">{mysqlRunning ? "Running" : "Stopped"}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-neutral-300">{status}</p>
      </div>
    </Wrapper>
  );
};

export default ServiceApp;
