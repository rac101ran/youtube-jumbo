import { PrimaryGeneratedColumn, Column, Entity, OneToMany, JoinTable, ManyToMany } from 'typeorm'
import { Users } from './user';

@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    videoId: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column()
    publishedAt: Date;

    @Column()
    thumbnailUrl: string;

    @Column()
    videoUrl: string;

    @ManyToMany(() => Users, user => user.watchLaterVideos)
    watchLaterUsers: Users[];
}

