// classes
import { GameWorker } from 'server/classes/game-worker';

// packets
import { P20D } from 'server/packets/p20D';

// packet object
export const packet = new (class {
	// controller
	public controller = (buffer: Buffer, worker: GameWorker, client: any) => {
		// get packet ID
		const pakcetID = buffer.readUInt16LE(4);

		// filter client state
		switch (client.state) {
			case 'login':
				// filter packet
				switch (pakcetID) {
					case 0x20d:
						new P20D(buffer).controller(worker, client);
						break;

					default:
						break;
				}
				break;
		}
	};
})();
