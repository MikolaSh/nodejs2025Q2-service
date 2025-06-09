import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'artists' })
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;
}
