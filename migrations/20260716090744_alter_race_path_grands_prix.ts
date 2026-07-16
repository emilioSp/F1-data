import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
      ALTER TABLE grands_prix ALTER COLUMN race_path DROP NOT NULL;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE grands_prix ALTER COLUMN race_path SET NOT NULL;
`);
}
