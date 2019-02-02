const SerialPort = require('serialport');
const ReadLine = require('@serialport/parser-readline');

const IS_ST = /(ST)/g;
const IS_DATA = /([0-9]*[.])?[0-9]+/gm;

async function getPort() {
    try {
        let portList = await SerialPort.list();
        const port = portList.filter((port) => ((port.manufacturer) ? port.manufacturer.includes('Prolific') : false));
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
    
    const parser = port.pipe(new ReadLine({ delimiter: '\r\n' }));
    parser.on('data', (data) => {
        let isMatchST = new RegExp(IS_ST);

        if(isMatchST.test(data)) {
            let newData = data.match(IS_DATA);
            return callback(newData.join(""));
        }

        return false;
    });
}