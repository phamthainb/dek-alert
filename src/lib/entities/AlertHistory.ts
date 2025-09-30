import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Monitor } from './Monitor';

@Entity('alert_history')
export class AlertHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  monitor_id!: string;

  @Column('text')
  timestamp!: string;

  @Column('text')
  message!: string;

  @Column('text')
  status!: 'alert' | 'normal';

  @ManyToOne(() => Monitor, (monitor) => monitor.alertHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'monitor_id' })
  monitor?: Monitor;
}
