const fs = require('fs');
const configFile = fs.readFileSync('./config.json');

module.exports = (env) => {
    return (conf) => {
        return configFile[conf] ? configFile[conf] : null;
    }
}