// database
import { db } from 'server/database';

// classes
import { packet } from 'server/classes/packet';

export class GameWorker {
	public init = async () => {
		await db.conn.connect();

		process.on('message', (message) => {
			if (typeof message === 'object' && typeof message.type === 'string') {
				switch (message.type) {
					case 'client-packet':
						this.onClientPacket(message.client, message.buffer);
						break;
				}
			}
		});
	};

	private onClientPacket = (client: any, bufferBase64: string) => {
		const buffer = Buffer.from(bufferBase64, 'base64');

		packet.controller(buffer, this, client);
	};

	public sendPacket = (clientID: string, buffer: Buffer) => {
		if (process.send) {
			process.send({
				type: 'send-packet',
				client: clientID,
				buffer: buffer.toString('base64'),
			});
		}
	};
}
