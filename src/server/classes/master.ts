// npm
import cp from 'child_process';
import path from 'path';

// database
import { db } from 'server/database';

// master class
export class Master {
	// initializer
	public init = async () => {
		// connect to database
		await db.conn.connect();

		// database migration
		await db.conn.synchronize();

		// initialize web process
		cp.fork(path.resolve(__dirname, 'web.js'), [], { stdio: 'inherit' });

		// initialize game process
		cp.fork(path.resolve(__dirname, 'game.js'), [], { stdio: 'inherit' });
	};
}
