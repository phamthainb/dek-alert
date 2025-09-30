import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn('text')
  id!: string;

  @Column('text', { unique: true })
  username!: string;

  @Column('text', { unique: true })
  email!: string;

  @Column('text')
  password_hash!: string;

  @Column('text')
  created_at!: string;

  @Column('text', { nullable: true })
  last_login?: string;

  @OneToMany('Session', 'user')
  sessions?: any[];
}
