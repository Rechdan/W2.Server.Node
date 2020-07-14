// npm
import net from 'net';
import os from 'os';
import cp from 'child_process';
import path from 'path';

// database
import { db } from 'server/database';

// classes
import { GameClient } from 'server/classes/game-client';

// game class
export class Game {
	// attributes
	private workers: cp.ChildProcess[] = [];
	private clients: GameClient[] = [];

	// initializer
	public init = async () => {
		// connect to database
		await db.conn.connect();

		// run workers
		this.workerManager();

		// run monsters

		// run events

		// init game server
		net.createServer()
			// on client connection
			.on('connection', (socket) => {
				// init client
				const client = new GameClient(socket);

				// add client to array
				this.clients.push(client);

				// event on socket closed
				socket.on('close', () => {
					// find client index on array
					const index = this.clients.findIndex((a) => a.id === client.id);
					// check is index is valid
					if (index > -1) {
						// removes client from array
						this.clients.splice(index, 1);
					}
				});
			})
			// on listening
			.on('listening', () => {
				// log
				console.log('Game running on port 8281');
			})
			// listen to WYD's port
			.listen(8281, '192.168.0.100');
	};

	// worker manager
	private workerManager = () => {
		// count cpu threads
		const threads = process.env.NODE_ENV === 'development' ? 2 : os.cpus().length;

		// initialize workers according to number of threads
		for (let i = 0; i < threads; i++) {
			// run worker
			this.workers.push(cp.fork(path.resolve(__dirname, 'game-worker.js'), [], { stdio: 'inherit' }));
		}
	};
}
