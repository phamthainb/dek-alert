import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('webhooks')
export class Webhook {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  name!: string;

  @Column('text', { nullable: true })
  url?: string;

  @Column('text')
  platform!: 'Slack' | 'Discord' | 'Generic' | 'Custom';
}
