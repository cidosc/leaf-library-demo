import {runWorker} from '../src/server/worker';
await runWorker({once:process.argv.includes('--once')});
