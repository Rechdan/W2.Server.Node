// struct
export class SHeader {
	// attributes
	public size: number; //			0 a 1		= 2
	public key: number; //			2			= 1
	public checkSum: number; //	3			= 1
	public packetID: number; //	4 a 5		= 2
	public clientID: number; //	6 a 7		= 2
	public timeStamp: number; //	8 a 11	= 4

	// constructor
	public constructor(packetID: number, size: number, clientID: number = 0) {
		// init attributes
		this.size = size;
		this.key = Math.round(Math.random() * 256);
		this.checkSum = 0;
		this.packetID = packetID;
		this.clientID = clientID;
		this.timeStamp = Math.floor(Date.now() / 1000);
	}

	// convert class to buffer
	public getBuffer = () => {
		const buffer = Buffer.alloc(12);

		buffer.writeUInt16LE(this.size, 0);
		buffer[2] = this.key;
		buffer[3] = this.checkSum;
		buffer.writeUInt16LE(this.packetID, 4);
		buffer.writeUInt16LE(this.clientID, 6);
		buffer.writeUInt32LE(this.timeStamp, 8);

		return buffer;
	};
}
