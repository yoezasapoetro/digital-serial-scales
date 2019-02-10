const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const { spawn } = require('child_process');
const deviceId = 'Device 1';
const deviceName = 'Hello';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://digital-scales-24658.firebaseio.com/'
});

const db = admin.database();
let ref = db.ref('digital-scales');

const child = spawn('node', ['scales.js', '--start-stream']);
child.stdout.on('data', (data) => {
    let weight = Buffer.from(data).toString('utf8');
    weight = weight.replace('\n', '')
    let stream = {
        weight,
        deviceId,
        deviceName
    };

    ref.update(stream);

    console.log(`Stream data to server https://digital-scales-24658.firebaseio.com/: `, stream);
});