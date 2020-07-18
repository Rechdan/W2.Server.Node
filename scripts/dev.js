// npm
import { EventEmitter } from 'events';
import path from 'path';
import cp from 'child_process';
import fs from 'fs';
import treeKill from 'tree-kill';

const dev = async () => {
	const events = new EventEmitter();

	const server = cp.exec('yarn dev-server');

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

	const runServer = () => {
		const serverPath = path.resolve(__dirname, '..', 'dist', 'server.js');

		if (fs.existsSync(serverPath)) {
			const { pid } = cp.spawn('node', [serverPath], { stdio: 'inherit', env: { NODE_ENV: 'development' } });

			events.once('server-bundle-end', () => {
				console.log('server restarting...');

				treeKill(pid, () => {
					runServer();
				});
			});
		} else {
			events.once('server-bundle-end', () => {
				runServer();
			});
		}
	};

	runServer();
};

dev();
