// https://github.com/Rechdan/Open-WYD-Server/blob/master/Emulator/Game/Packet/Packets/P_10A.cs

// classes
import { GameClient } from 'server/classes/game-client';

// structs
import { SHeader } from 'server/structs/sHeader';

export class P_10A {
	public constructor() {}

	public getBuffer = () => {
		const buffer = Buffer.alloc(1928);

		new SHeader(0x10a, 1928, 30002).getBuffer().copy(buffer, 0, 0);

		return buffer;
	};

	public static send = (client: GameClient) => {
		const buffer = new P_10A().getBuffer();

		client.send(buffer);
	};
}
