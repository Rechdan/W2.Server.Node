// npm
import express from 'express';
import helmet from 'helmet';
import http from 'http';

// web class
export class Web {
	// initializer
	public init = () => {
		// initialize express
		const app = express()
			// hpp header protection
			.use(helmet())
			// repsonse to client channel listing
			.get('/server/status', (_req, res) => res.type('text').send([100].join('\n')));

		// initialize http
		http
			// created http server
			.createServer(app)
			// event on listening
			.on('listening', () => {
				// log
				console.log('http://192.168.0.100:3000/');
			})
			// listen to port 3000
			.listen(3000, '192.168.0.100');
	};
}
