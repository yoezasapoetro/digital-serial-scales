#!/usr/bin/env node

const serial = require(`./serial`);
const program = require('commander');

program
    .version('0.0.2')
    .option('-s, --start-stream', 'Start Stream', () => serial(console.log))
    .parse(process.argv);
