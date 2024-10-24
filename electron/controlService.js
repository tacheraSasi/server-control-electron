import { exec } from 'child_process';
import { app } from 'electron';

// This function controls the specified service (start/stop)
const controlService = (service, action) => {
  const command = `pkexec systemctl ${action} ${service}`;
  exec(command, (error, stdout, stderr) => {
    const message = error ? `Error: ${stderr}` : `Success: ${stdout}`;
    // Displaying a balloon notification
    if (tray) {
      tray.displayBalloon({
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} ${service.charAt(0).toUpperCase() + service.slice(1)}`,
        content: message,
      });
    }
  });
};

export default controlService;
