// npm
import net from 'net';
import crypto from 'crypto';

// database
import { UserEntity } from 'server/database/user';

// classes
import { packetSecurity } from 'server/classes/packet-security';
import { packet } from 'server/classes/packet';

export class GameClient {
	private socket: net.Socket;
	public id: string;
	public state: 'connection' | 'login' | 'password' | 'characters' | 'game' = 'connection';

	public user!: UserEntity;

	public constructor(socket: net.Socket) {
		this.socket = socket;
		this.id = crypto.randomBytes(10).toString('hex');

		this.socket.on('data', this.onDataReceived);
	}

	private onDataReceived = (buffer: Buffer) => {
		if (this.state === 'connection') {
			if (buffer.length === 4 || buffer.length === 120) {
				this.state = 'login';

				if (buffer.length === 120) {
					this.onDataReceived(buffer.slice(4));
				}
			} else {
				this.close();
			}
		} else {
			packetSecurity.decrypt(buffer);

			packet.controller(this, buffer);
		}
	};

	public send = (buffer: Buffer) => {
		packetSecurity.encrypt(buffer);

		this.socket.write(buffer);
	};

	public close = () => {
		this.socket.destroy();
	};
}
