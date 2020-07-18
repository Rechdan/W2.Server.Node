// npm
import express from 'express';
import helmet from 'helmet';
import http from 'http';

export class Web {
	public init = () => {
		const app = express()
			.use(helmet())
			.get('/server/status', (_req, res) => res.type('text').send([100].join('\n')));

		http
			.createServer(app)
			.on('listening', () => {
				console.log('http://192.168.0.100:3000/');
			})
			.listen(3000, '192.168.0.100');
	};
}
