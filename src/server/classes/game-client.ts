// npm
import net from 'net';
import crypto from 'crypto';
import { packet } from 'server/classes/packet';

// game client class
export class GameClient {
	// attributes
	private socket: net.Socket;
	public id: string;
	public state: 'connection' | 'login' | 'password' | 'characters' | 'game' = 'connection';

	// constructor
	public constructor(socket: net.Socket) {
		// client attributes
		this.socket = socket;
		this.id = crypto.randomBytes(10).toString('hex');

		// log
		console.log('id:', this.id);

		// prepare client socket
		this.socket.on('data', this.onDataReceived);
	}

	// on data received
	private onDataReceived = (buffer: Buffer) => {
		// log
		console.log('id:', this.id, 'state:', this.state, 'data length:', buffer.length);
		// checks if client is in connection state
		if (this.state === 'connection') {
			// check if packet is connection or connection and login
			if (buffer.length === 4 || buffer.length === 120) {
				// updates client state
				this.state = 'login';
				// checks if has login packet
				if (buffer.length === 120) {
					// removes the connection bytes and calls data received
					this.onDataReceived(buffer.slice(4));
				}
			} else {
				// invalid
			}
		} else {
			// packet decrypt
			packet.decrypt(buffer);

			// send to packet control
			packet.controller(buffer, this);
		}
	};

	// closes client connection
	public close = () => {
		this.socket.destroy();
	};
}
