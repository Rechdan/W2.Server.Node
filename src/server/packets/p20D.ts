// database
import { db } from 'server/database';

// classes
import { GameWorker } from 'server/classes/game-worker';

// packets
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
	public controller = async (worker: GameWorker, client: any) => {
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
			P101.send(worker, client, 'Senha inválida!');
		} else {
			if (process.send) {
				// sets user
				process.send({
					type: 'set-client-user',
					client: client.id,
					user,
				});
			}

			// test
			P101.send(worker, client, `Seu ID é: ${user.id}`);
		}
	};
}
