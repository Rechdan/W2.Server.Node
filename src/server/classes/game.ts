// npm
import net from 'net';

// classes
import { GameClient } from 'server/classes/game-client';

export class Game {
	private clients: GameClient[] = [];

	public init = () => {
		net.createServer()
			.on('connection', (socket) => {
				const client = new GameClient(socket);

				this.clients.push(client);

				socket.on('close', () => {
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
}
