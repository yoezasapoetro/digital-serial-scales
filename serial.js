const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

async function getPort() {
    try {
        let portList = await SerialPort.list();
        const port = portList.filter((port) => port.manufacturer == 'Prolific');
        return port[0].comName;
    } catch (err) {
        console.error('getPort, Error: ', err.message);
    }
}

module.exports = async (callback) => {
    const comName = await getPort();
    const port = new SerialPort(comName, {
        dataBits: 8,
        stopBits: 1
    }, (err) => {
        if(err) {
            return console.error('SerialError:', err.message);
        }
    });

    port.on('error', console.error);
    
    const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
    parser.on('data', callback);

    port.on('close', console.log);
}