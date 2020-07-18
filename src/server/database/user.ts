// npm
import { Entity, PrimaryGeneratedColumn, Index, Column, CreateDateColumn } from 'typeorm';

// user category
enum UserCategory {
	PLAYER = 'player',
	ADMIN = 'admin',
}

// entity
@Entity({ name: 'user' })
export class UserEntity {
	// columns

	@PrimaryGeneratedColumn('increment')
	id!: number;

	@Index()
	@Column('enum', { enum: UserCategory, default: UserCategory.PLAYER })
	category!: UserCategory;

	@Index({ unique: true })
	@Column('varchar', { length: 200 })
	username!: string;

	@Index()
	@Column('varchar', { length: 200 })
	password!: string;

	@Index()
	@Column('varchar', { length: 200, nullable: true, default: null })
	numeric!: string | null;

	@Index()
	@CreateDateColumn()
	created!: Date;
}
