// npm
import net from 'net';
import crypto from 'crypto';

// database
import { DB } from 'server/database/types';

// classes
import { packetSecurity } from 'server/classes/packet-security';

// game client class
export class GameClient {
	// attributes
	private socket: net.Socket;
	public id: string;
	public state: 'connection' | 'login' | 'password' | 'characters' | 'game' = 'connection';

	public user: DB.User | null = null;

	// constructor
	public constructor(socket: net.Socket) {
		// client attributes
		this.socket = socket;
		this.id = crypto.randomBytes(10).toString('hex');

		// log
		console.log('id:', this.id);
	}

	// send packet
	public send = (buffer: Buffer) => {
		// encrypt buffer
		packetSecurity.encrypt(buffer);

		// send buffer to connection
		this.socket.write(buffer);
	};

	// closes client connection
	public close = () => {
		this.socket.destroy();
	};
}
