// classes
import { GameClient } from 'server/classes/game-client';

// structs
import { SHeader } from 'server/structs/sHeader';

// packet
export class P101 {
	// attributes
	public message: string;

	// constructor
	public constructor(message: string) {
		// init attributes
		this.message = message;
	}

	// convert class to buffer
	public getBuffer = () => {
		const buffer = Buffer.alloc(108);

		new SHeader(0x101, 108).getBuffer().copy(buffer, 0, 0);

		buffer.write(this.message, 12, this.message.length, 'ascii');

		return buffer;
	};

	// helper
	public static send = (client: GameClient, message: string) => {
		// create buffer
		const buffer = new P101(message).getBuffer();

		// send buffer to client
		client.send(buffer);
	};
}
