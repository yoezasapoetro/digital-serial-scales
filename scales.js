#!/usr/bin/env node

const serial = require(`./serial`);
const program = require('commander');

program
    .version('0.0.2')
    .option('-s, --start-stream', 'Start Stream', () => {
        serial((data) => {
            let serialData = data.match(/[(0-9)(.)]/g);
            console.log(serialData.join(""))
        });
    })
    .parse(process.argv);
