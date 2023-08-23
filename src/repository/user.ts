import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, JoinTable } from 'typeorm'
import { Video } from './video';

@Entity({ name: 'jumbo_users' })
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @ManyToMany(() => Video, video => video.watchLaterUsers)
    @JoinTable()
    watchLaterVideos: Video[];
}