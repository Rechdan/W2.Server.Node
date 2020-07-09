// npm
import { EventEmitter } from 'events';
import ParcelBundler from 'parcel-bundler';
import path from 'path';
import cp from 'child_process';
import treeKill from 'tree-kill';

// dev function
const dev = async () => {
	// event emitter
	const events = new EventEmitter();

	// bundlers
	const server = new ParcelBundler(path.resolve(__dirname, '..', 'src', 'server', 'index.ts'), {
		outDir: path.resolve(__dirname, '..', 'dist'),
		outFile: 'server.js',
		watch: true,
		cache: false,
		target: 'node',
		bundleNodeModules: true,
		hmr: false,
		logLevel: 0,
		autoInstall: false,
		throwErrors: false,
	});

	// bundlers events
	server.on('buildEnd', () => events.emit('server-bundle-end'));

	// run bundlers
	await server.bundle();

	// run server
	const runServer = () => {
		// start process
		const { pid } = cp.spawn('node', [path.resolve(__dirname, '..', 'dist', 'server.js')], { stdio: 'inherit', env: { NODE_ENV: 'development' } });

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
	};

	// run server runner
	runServer();
};

// run dev
dev();
