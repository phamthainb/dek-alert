import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { AlertHistory } from './AlertHistory';

@Entity('monitors')
export class Monitor {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  name!: string;

  @Column('text')
  type!: 'Elasticsearch' | 'SQL';

  @Column('text')
  status!: 'normal' | 'alert' | 'pending';

  @Column('text', { nullable: true })
  lastCheck?: string;

  @Column('text', { nullable: true })
  keywords?: string; // JSON array of strings

  @Column('text', { nullable: true })
  dbType?: 'Oracle' | 'MySQL' | 'PostgreSQL';

  @Column('text', { nullable: true })
  query?: string;

  @Column('text', { nullable: true })
  schedule?: string;

  @OneToMany(() => AlertHistory, (alertHistory) => alertHistory.monitor)
  alertHistory?: AlertHistory[];
}
