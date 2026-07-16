import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
      ALTER TABLE grands_prix ALTER COLUMN qualifying_path DROP NOT NULL;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE grands_prix ALTER COLUMN qualifying_path SET NOT NULL;
`);
}
