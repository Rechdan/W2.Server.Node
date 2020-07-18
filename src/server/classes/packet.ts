// classes
import { GameClient } from 'server/classes/game-client';

// packets
import { P_20D } from 'server/packets/p20D';
import { P_FDE } from 'server/packets/pFDE';

export const packet = new (class {
	public controller = (client: GameClient, buffer: Buffer) => {
		const pakcetID = buffer.readUInt16LE(4);

		switch (client.state) {
			case 'login':
				switch (pakcetID) {
					case 0x20d:
						new P_20D(buffer).controller(client);
						break;

					default:
						client.close();
						break;
				}
				break;

			case 'password':
				switch (pakcetID) {
					case 0xfde:
						new P_FDE(buffer).validateNumeric(client);
						break;

					default:
						// client.close();
						console.log('unk:', pakcetID.toString(16));
						break;
				}
				break;

			case 'characters':
				switch (pakcetID) {
					case 0xfde:
						new P_FDE(buffer).changeNumeric(client);
						break;

					default:
						// client.close();
						console.log('unk:', pakcetID.toString(16));
						break;
				}
				break;

			case 'game':
				break;
		}
	};
})();
