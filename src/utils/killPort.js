const os = require('os');
const { exec } = require('child_process');

module.exports.killPort = function (port) {
    console.log(port)
    if (os.platform() === 'win32') findProcessAndKill();
    else if (os.platform() === 'linux') findProcessAndKillLinux()
    else if (os.platform() === 'darwin') findProcessAndKillMacOS()

    function findProcessAndKill() {
        exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
            if (error) return;

            const lines = stdout.trim().split('\r\n');
            if (lines.length <= 1) return;

            lines.slice(1).forEach(line => {
                const parts = line.trim().split(/\s+/);
                const pid = parts[parts.length - 1];
                if (!isNaN(parseInt(pid))) {
                    exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
                        if (error) return;
                    });
                }
            });
        });
    }

    function findProcessAndKillLinux() {
        exec(`lsof -ti:${port}`, (error, stdout, stderr) => {
            if (error) return;


            const processIds = stdout.trim().split('\n');
            if (processIds.length === 0) return;

            processIds.forEach(pid => {
                exec(`kill -9 ${port}`, (error, stdout, stderr) => {
                    if (error) return;
                });
            });
        });
    }

    function findProcessAndKillMacOS() {
        const { exec } = require('child_process');
        exec(`lsof -ti:${port}`, (error, stdout, stderr) => {
            if (error) return;

            const processIds = stdout.trim().split('\n');
            if (processIds.length === 0) return;

            processIds.forEach(pid => {
                exec(`kill -9 ${port}`, (error, stdout, stderr) => {
                    if (error) return;
                });
            });
        });
    }
}
