// npm
import net from 'net';
import crypto from 'crypto';

// database
import { UserEntity } from 'server/database/user';

// classes
import { packet } from 'server/classes/packet';
import { packetSecurity } from 'server/classes/packet-security';

// game client class
export class GameClient {
	// attributes
	private socket: net.Socket;
	public id: string;
	public state: 'connection' | 'login' | 'password' | 'characters' | 'game' = 'connection';

	public user: UserEntity | null = null;

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
				// close connection
				this.close();
			}
		} else {
			// packet decrypt
			packetSecurity.decrypt(buffer);

			// send to packet control
			packet.controller(buffer, this);
		}
	};

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
