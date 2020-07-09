// npm
import cluster from 'cluster';

// master object
export const master = new (class {
	// initializer
	public init = () => {
		// web server
		cluster.fork({ type: 'WEB' });

		// game server
		cluster.fork({ type: 'GAME' });
	};
})();
