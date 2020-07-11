// database
import { db } from 'server/database';

// classes
import { GameClient } from 'server/classes/game-client';
import { P101 } from 'server/packets/p101';

// packet
export class P20D {
	// attributes
	public username: string;
	public password: string;

	// constructor
	public constructor(buffer: Buffer) {
		// init attributes
		this.username = buffer.toString('ascii', 24, 36).replace(/[\0]+/g, '');
		this.password = buffer.toString('ascii', 12, 22).replace(/[\0]+/g, '');
	}

	// controller
	public controller = async (client: GameClient) => {
		// extract from this
		const { username, password } = this;

		// fetch username
		let user = await db.user.findOne({ where: { username } });

		// checks if user exists
		if (user === undefined) {
			// create user
			user = await db.user.create({ username, password }).save();
		}

		// validates user password
		if (password !== user.password) {
			// invalid password
			P101.send(client, 'Senha inválida!');
		} else {
			// sets user
			client.user = user;

			// test
			P101.send(client, `Seu ID é: ${client.user.id}`);
		}
	};
}
