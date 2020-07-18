// database
import { db } from 'server/database';

// classes
import { Web } from 'server/classes/web';
import { Game } from 'server/classes/game';

export class Master {
	public web!: Web;
	public game!: Game;

	public init = async () => {
		await db.conn.connect();
		await db.conn.synchronize();

		this.web = new Web();
		this.web.init();

		this.game = new Game();
		this.game.init();
	};
}
