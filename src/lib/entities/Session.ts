import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  user_id!: string;

  @Column('text')
  expires_at!: string;

  @Column('text')
  created_at!: string;

  @ManyToOne('User', 'sessions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: any;
}
