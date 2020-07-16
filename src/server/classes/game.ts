// npm
import net from 'net';
import os from 'os';
import cp from 'child_process';
import path from 'path';

// database
import { db } from 'server/database';

// classes
import { GameClient } from 'server/classes/game-client';
import { packetSecurity } from 'server/classes/packet-security';

export class Game {
	private workers: cp.ChildProcess[] = [];
	private currWorker: number = 0;

	private clients: GameClient[] = [];

	public init = async () => {
		await db.conn.connect();

		this.workerManager();

		net.createServer()
			.on('connection', (socket) => {
				const client = new GameClient(socket);

				this.clients.push(client);

				socket
					.on('data', (buffer) => this.onClientDataReceived(client, buffer))
					.on('close', () => {
						const index = this.clients.findIndex((a) => a.id === client.id);

						if (index > -1) {
							this.clients.splice(index, 1);
						}
					});
			})
			.on('listening', () => {
				console.log('Game running on port 8281');
			})
			.listen(8281, '192.168.0.100');
	};

	/**
	 * WORKERS
	 */

	private workerManager = () => {
		const threads = process.env.NODE_ENV === 'development' ? 1 : os.cpus().length;

		for (let i = 0; i < threads; i++) {
			const worker = cp.fork(path.resolve(__dirname, 'game-worker.js'), [], {
				stdio: 'inherit',
				env: {
					WORKER_ID: `${i}`,
				},
			});

			worker.on('message', (message) => this.onWorkerMessageReceived(worker, message));

			this.workers.push(worker);
		}
	};

	private sendDataToWorker = (client: GameClient, buffer: Buffer) => {
		const workerLength = this.workers.length;

		const worker = this.workers[this.currWorker++ % workerLength];

		worker.send({
			type: 'client-packet',
			client: {
				id: client.id,
				state: client.state,
				user: client.user,
			},
			buffer: buffer.toString('base64'),
		});
	};

	private onWorkerMessageReceived = (worker: cp.ChildProcess, message: any) => {
		if (typeof message === 'object' && typeof message.type === 'string') {
			switch (message.type) {
				case 'send-packet':
					this.onSendPacket(message.client, message.buffer);
					break;

				case 'set-client-user':
					this.onSetClientUser(message.client, message.user);
					break;
			}
		}
	};

	private onSendPacket = (clientID: string, bufferBase64: string) => {
		const client = this.getClientByID(clientID);

		if (client) {
			const buffer = Buffer.from(bufferBase64, 'base64');

			client.send(buffer);
		}
	};

	private onSetClientUser = (clientID: string, user: any) => {
		const client = this.getClientByID(clientID);

		if (client) {
			client.user = user;

			console.log('user:', client.user);
		}
	};

	/**
	 * CLIENTS
	 */

	private getClientByID = (clientID: string) => {
		return this.clients.find((a) => a.id === clientID);
	};

	private onClientDataReceived = (client: GameClient, buffer: Buffer) => {
		if (client.state === 'connection') {
			if (buffer.length === 4 || buffer.length === 120) {
				client.state = 'login';

				if (buffer.length === 120) {
					this.onClientDataReceived(client, buffer.slice(4));
				}
			} else {
				client.close();
			}
		} else {
			packetSecurity.decrypt(buffer);

			this.sendDataToWorker(client, buffer);
		}
	};
}
