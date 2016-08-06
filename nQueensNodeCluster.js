const cluster = require('cluster');
const os = require('os');

const board = Math.pow(2, 16) - 1;

if (cluster.isMaster) {
  const timeStarted = Date.now();
  let position = ~(0 | 0 | 0) & board; // in base 2;
  let count = 0;

  function currentBit() {
    const bit = position & -position;
    position = position ^ bit;

    return bit;
  };

  for (let i = 0; i < os.cpus().length; i++) {
    if (position) {
      const worker = cluster.fork();
      const bit = currentBit();

      worker.send({minorD: bit << 1, column: bit, majorD: bit >> 1});

      worker.on('message', (message) => {
        if (message === 'solving' && position) {
          const bit = currentBit();

          worker.send({minorD: bit << 1, column: bit, majorD: bit >> 1});
        } else if (message === 'solution') {
          count++;
        } else {
          worker.kill();
        }
      });
    } 
  }
  
  cluster.on('exit', function(worker, code, signal) {
    if (!Object.keys(cluster.workers).length) {
      cluster.disconnect();
      console.log(`We have ${count} solution${(count > 1 ? 's' : '')} found in ${(Date.now() - timeStarted).getSeconds()} secs.`);
    }
  });
} else {
  function solve(minorD, column, majorD) {
    if (board === column) {
      process.send('solution');
    }

    let position = ~(minorD | column | majorD) & board;
    
    while (position) {
      const bit = position & -position;
      position = position ^ bit;
     
      solve((minorD | bit) << 1, column | bit, (majorD | bit) >> 1); 
    }
  }

  process.on('message', ({minorD, column, majorD}) => {
    solve(minorD, column, majorD);

    process.send('solving');
  });
}
