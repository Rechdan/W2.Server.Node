// npm
import { EventEmitter } from 'events';
import path from 'path';
import cp from 'child_process';
import fs from 'fs';
import treeKill from 'tree-kill';

// dev function
const dev = async () => {
	// event emitter
	const events = new EventEmitter();

	// bundlers
	const server = cp.exec('yarn dev-server');

	// server output
	server.stdout.on('data', (data) => {
		if (typeof data !== 'string') {
			console.log('[server_build]:', data);
		} else {
			data
				.trim()
				.split('\n')
				.forEach((data) => {
					console.log('[server_build]:', data);

					if (data.indexOf('Built in ') !== -1) {
						events.emit('server-bundle-end');
					}
				});
		}
	});

	// run server
	const runServer = () => {
		// server path
		const serverPath = path.resolve(__dirname, '..', 'dist', 'server.js');

		// check if server was built
		if (fs.existsSync(serverPath)) {
			// start process
			const { pid } = cp.spawn('node', [serverPath], { stdio: 'inherit', env: { NODE_ENV: 'development' } });

			// in server build
			events.once('server-bundle-end', () => {
				// log
				console.log('server restarting...');

				// kill process
				treeKill(pid, () => {
					// run server runner
					runServer();
				});
			});
		} else {
			// run server runner
			runServer();
		}
	};

	// run server runner
	runServer();
};

// run dev
dev();
