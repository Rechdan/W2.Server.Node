// npm
import { Entity, BaseEntity, PrimaryGeneratedColumn, Index, Column, CreateDateColumn } from 'typeorm';

// database
import { DB } from 'server/database/types';

// entity
@Entity({ name: 'user' })
export class UserEntity extends BaseEntity implements DB.User {
	// columns

	@PrimaryGeneratedColumn('increment')
	id!: number;

	@Index()
	@Column('enum', { enum: DB.UserCategory, default: DB.UserCategory.PLAYER })
	category!: DB.UserCategory;

	@Index({ unique: true })
	@Column('varchar', { length: 200 })
	username!: string;

	@Index()
	@Column('varchar', { length: 200 })
	password!: string;

	@Index()
	@Column('varchar', { length: 200, nullable: true, default: null })
	numeric!: string;

	@Index()
	@CreateDateColumn()
	created!: Date;
}
