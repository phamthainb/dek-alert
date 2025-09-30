import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('data_sources')
export class DataSource {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  name!: string;

  @Column('text')
  type!: 'Elasticsearch' | 'PostgreSQL' | 'Oracle' | 'MySQL';

  @Column('text', { nullable: true })
  url?: string;

  @Column('text', { nullable: true })
  apiKey?: string;

  @Column('text', { nullable: true })
  host?: string;

  @Column('integer', { nullable: true })
  port?: number;

  @Column('text', { nullable: true })
  user?: string;

  @Column('text', { nullable: true })
  password?: string;

  @Column('text', { nullable: true })
  database?: string;
}
