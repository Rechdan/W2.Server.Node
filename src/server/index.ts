// npm
import cluster from 'cluster';

// classes
import { master } from 'server/classes/master';
import { web } from 'server/classes/web';
import { game } from 'server/classes/game';

// checks if is master
if (cluster.isMaster) {
	// clear old logs
	console.clear();
	// log
	console.log('-> master');
	// init master
	master.init();
} else if (cluster.isWorker) {
	// log
	console.log('-> worker:', process.env.type);
	// filter process type
	switch (process.env.type) {
		case 'WEB':
			// initialize web server
			web.init();
			break;

		case 'GAME':
			// initialize game server
			game.init();
			break;

		default:
			throw '?????? x2';
	}
} else {
	throw '?????? x1';
}
