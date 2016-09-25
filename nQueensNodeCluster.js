const cluster = require('cluster');
const os = require('os');
const board = Math.pow(2, 16) - 1;

if (cluster.isMaster) {
  const timeStarted = Date.now();
  let position = ~(0 | 0 | 0) & board; // in base 2;
  let count = 0;

  const currentBit = () => {
    const bit = position & -position;
    position = position ^ bit;

    return { minorD: bit << 1, column: bit, majorD: bit >> 1 };
  };

  const messageHandler = (worker) =>
    (msg) => {
      if (msg === 'solving' && position) worker.send(currentBit());
      else if (msg === 'solution') count++;
      else worker.kill();
    };

  for (let i = 0; i < os.cpus().length && position; i++) {
    const worker = cluster.fork();

    worker.send(currentBit());
    worker.on('message', messageHandler(worker));
  }

  let disconnected = false;
  cluster.on('exit', () => {
    if (!Object.keys(cluster.workers).length && !disconnected) {
      cluster.disconnect();
      disconnected = true;
      const time = (Date.now() - timeStarted) / 1000;
      console.log(`${count} solution${(count > 1 ? 's' : '')} (time: ${time} seconds)`);
    }
  });
} else {
  const solve = (minorD, column, majorD) => {
    if (board === column) process.send('solution');

    let position = ~(minorD | column | majorD) & board;

    while (position) {
      const bit = position & -position;
      position = position ^ bit;

      solve((minorD | bit) << 1, column | bit, (majorD | bit) >> 1);
    }
  };

  process.on('message', ({ minorD, column, majorD }) => {
    solve(minorD, column, majorD);
    process.send('solving');
  });
}
