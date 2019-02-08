const config = require('./config')(process.env.NODE_ENV);

const SERVER_SOCKET = [config('socket_server'), config('socket_port')].join(':');
const socket = require('socket.io-client');
const { spawn } = require('child_process');
const consoleSocket = socket.connect(SERVER_SOCKET);
const deviceId = 'Device 1';
const deviceName = 'Hello';

consoleSocket.on('connect', () => {
    consoleSocket.emit('console_connect', { deviceId, deviceName });
});

consoleSocket.on('console_request_data', (serverData) => {
    const userSocketId = serverData.socketId;

    setImmediate(() => {
        const child = spawn('node', ['scales.js', '--start-stream']);
        child.stdout.on('data', (data) => {
            consoleSocket.emit('console_response_data', {
                userSocketId,
                data: Buffer.from(data).toString('utf8')
            });
        });
    });
});