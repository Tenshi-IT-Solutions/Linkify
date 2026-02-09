import { exec } from 'child_process';
import net from 'net';

export const findAvailablePort = async (startPort, endPort = startPort + 10) => {
    for (let port = startPort; port <= endPort; port++) {
        try {
            await new Promise((resolve, reject) => {
                const server = net.createServer()
                    .once('error', err => {
                        if (err.code === 'EADDRINUSE') {
                            resolve(false);
                        } else {
                            reject(err);
                        }
                    })
                    .once('listening', () => {
                        server.close();
                        resolve(true);
                    })
                    .listen(port);
            });
            return port;
        } catch (err) {
            console.error(`Error checking port ${port}:`, err);
            continue;
        }
    }
    throw new Error(`No available ports found between ${startPort} and ${endPort}`);
};

export const killProcessOnPort = async (port) => {
    return new Promise((resolve, reject) => {
        const command = process.platform === 'win32' 
            ? `netstat -ano | findstr :${port}`
            : `lsof -i :${port}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`No process found on port ${port}`);
                resolve();
                return;
            }

            const lines = stdout.split('\n');
            for (const line of lines) {
                if (!line.trim()) continue;

                let pid;
                if (process.platform === 'win32') {
                    pid = line.split(/\s+/)[5];
                } else {
                    const parts = line.split(/\s+/);
                    pid = parts[1];
                }

                if (pid) {
                    const killCommand = process.platform === 'win32'
                        ? `taskkill /F /PID ${pid}`
                        : `kill -9 ${pid}`;

                    exec(killCommand, (err) => {
                        if (err) {
                            console.error(`Error killing process ${pid}:`, err);
                        } else {
                            console.log(`Successfully killed process ${pid} on port ${port}`);
                        }
                    });
                }
            }
            resolve();
        });
    });
}; 