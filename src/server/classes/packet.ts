// classes
import { GameClient } from 'server/classes/game-client';

// packets
import { P20D } from 'server/packets/p20D';

// packet object
export const packet = new (class {
	// controller
	public controller = (buffer: Buffer, client: GameClient) => {
		// get packet ID
		const pakcetID = buffer.readUInt16LE(4);

		// filter client state
		switch (client.state) {
			case 'login':
				// filter packet
				switch (pakcetID) {
					case 0x20d:
						new P20D(buffer).controller(client);
						break;

					default:
						client.close();
						break;
				}
				break;
		}
	};
})();
