// database
import { db } from 'server/database';

// classes
import { GameClient } from 'server/classes/game-client';

// structs
import { SHeader } from 'server/structs/sHeader';

// packets
import { P_101 } from 'server/packets/p101';

export class P_FDE {
	public numeric: string;

	public constructor(buffer: Buffer) {
		this.numeric = buffer.toString('ascii', 12, 18).replace(/[\0]+/g, '');
	}

	public validateNumeric = async (client: GameClient) => {
		const { numeric } = this;

		if (client.user.numeric === null) {
			client.user.numeric = numeric;

			await db.user().save(client.user);

			P_101.send(client, 'Senha numérica definida com sucesso!');
		} else if (client.user.numeric !== numeric) {
			client.send(signals.FDF);
			return;
		} else {
			P_101.send(client, 'Seja bem-vindo!');
		}

		client.state = 'characters';
		client.send(signals.FDE);
	};

	public changeNumeric = async (client: GameClient) => {
		const { numeric } = this;

		client.user.numeric = numeric;

		await db.user().save(client.user);

		P_101.send(client, 'Senha numérica alterada com sucesso!');

		client.send(signals.FDE);
	};
}

const signals = {
	FDF: new SHeader(0xfdf, 12).getBuffer(),
	FDE: new SHeader(0xfde, 12).getBuffer(),
};
