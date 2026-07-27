import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
      ALTER TABLE drivers_standings ALTER COLUMN points TYPE NUMERIC(6,1);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
      ALTER TABLE drivers_standings ALTER COLUMN points TYPE INTEGER
`);
}
