// npm
import net from 'net';
import { GameClient } from 'server/classes/game-client';

// game object
export const game = new (class {
	// attributes
	private clients: GameClient[];

	// constructor
	public constructor() {
		// game attributes
		this.clients = [];
	}

	// initializer
	public init = () => {
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
})();
