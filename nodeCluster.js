const cluster = require('cluster');
const cpus = require('os').cpus().length;

const getTime = () => {
  const secs = (new Date).getSeconds();
  const milli = (new Date).getMilliseconds();
  return `${secs}.${milli}`;
};

const messageHandler = (worker) => // listens for messages coming from worker
    (msg) => {
      if (msg === 'exit') {
        worker.kill();
        console.log(`Worker #${worker.process.pid} exiting ${getTime()}`);
      }
    };

if (cluster.isMaster) { // We start the workers here
  for (let i = 0; i < cpus; i++) {
    const worker = cluster.fork();

    console.log(`Starting worker #${worker.process.pid} ${getTime()}`);

    worker.on('message', messageHandler(worker));
  }

  // listener when a worker is 'fully' running
  cluster.on('online', worker => {
    console.log(`Worker #${worker.process.pid} online at ${getTime()}`);
  });

  // listener when a worker exits
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker #${worker.process.pid} exits with code: ${code} signal: ${signal}`);
  });
} else {
  // we go here everytime we fork / a worker is online
  console.log(`Worker #${process.pid} outside master ${getTime()}`);
  process.send('exit');
}
