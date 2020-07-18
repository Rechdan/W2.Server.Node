// database
import { db } from 'server/database';

// classes
import { GameClient } from 'server/classes/game-client';

// packets
import { P_101 } from 'server/packets/p101';
import { P_10A } from 'server/packets/p10A';

export class P_20D {
	public username: string;
	public password: string;

	public constructor(buffer: Buffer) {
		this.username = buffer.toString('ascii', 24, 36).replace(/[\0]+/g, '');
		this.password = buffer.toString('ascii', 12, 22).replace(/[\0]+/g, '');
	}

	public controller = async (client: GameClient) => {
		const { username, password } = this;

		let user = await db.user().findOne({ where: { username } });

		if (user === undefined) {
			user = await db.user().save(db.user().create({ username, password }));
		}

		if (password !== user.password) {
			P_101.send(client, 'Senha inválida!');
		} else {
			client.state = 'password';
			client.user = user;

			P_10A.send(client);
			P_101.send(client, `Seu ID é: ${user.id}`);
		}
	};
}
