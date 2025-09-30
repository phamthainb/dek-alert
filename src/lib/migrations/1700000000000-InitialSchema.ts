import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'username',
            type: 'text',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'email',
            type: 'text',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password_hash',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'last_login',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Create sessions table
    await queryRunner.createTable(
      new Table({
        name: 'sessions',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'expires_at',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'text',
            isNullable: false,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'sessions',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    // Create monitors table
    await queryRunner.createTable(
      new Table({
        name: 'monitors',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'lastCheck',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'keywords',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'dbType',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'query',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'schedule',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Create alert_history table
    await queryRunner.createTable(
      new Table({
        name: 'alert_history',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'monitor_id',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'timestamp',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'message',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'text',
            isNullable: false,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'alert_history',
      new TableForeignKey({
        columnNames: ['monitor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'monitors',
        onDelete: 'CASCADE',
      })
    );

    // Create data_sources table
    await queryRunner.createTable(
      new Table({
        name: 'data_sources',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'apiKey',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'host',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'port',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'user',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'password',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'database',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Create webhooks table
    await queryRunner.createTable(
      new Table({
        name: 'webhooks',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'platform',
            type: 'text',
            isNullable: false,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('alert_history');
    await queryRunner.dropTable('sessions');
    await queryRunner.dropTable('monitors');
    await queryRunner.dropTable('data_sources');
    await queryRunner.dropTable('webhooks');
    await queryRunner.dropTable('users');
  }
}
