// npm
import cluster from 'cluster';

// database
import { db } from 'server/database';

// master object
export const master = new (class {
	// initializer
	public init = async () => {
		// connect to database
		await db.conn.connect();

		// database migration
		await db.conn.synchronize();

		// web server
		cluster.fork({ type: 'WEB' });

		// game server
		cluster.fork({ type: 'GAME' });
	};
})();
