// npm
import { ConnectionOptions, getConnectionManager } from 'typeorm';

// database
import { UserEntity } from 'server/database/user';

// database conneciton options
const connectionOptions: ConnectionOptions = {
	name: 'default',

	type: 'mysql',

	host: '192.168.0.100',
	port: 3306,
	username: 'root',
	password: '',
	database: 'w2-node',

	entities: [UserEntity],
};

// db connection
const conn = getConnectionManager().create(connectionOptions);

// database object
export const db = {
	// connection
	conn,

	// entities
	user: () => conn.getRepository(UserEntity),
};
