const SERVER_PORT = 12695;

const Koa = require('koa');
const JSONStream = require('streaming-json-stringify');
const app = new Koa();
const { spawn } = require('child_process');

app.use(async (ctx) => {
    ctx.type = 'json';
    const stream = ctx.body = JSONStream();

    stream.on('error', ctx.onerror);

    setImmediate(() => {
        const child = spawn('node', ['scales.js', '--start-stream']);
        child.stdout.on('data', (data) => {
            let bufferOriginal = Buffer.from(data);
            stream.write({
                data: bufferOriginal.toString('utf8')
            });
        });
    });
});

app.listen(SERVER_PORT);