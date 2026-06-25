import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS drivers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        racing_number INTEGER,
        name TEXT NOT NULL,
        team_name TEXT NOT NULL,
        team_color TEXT,
        headshot_url TEXT,
        UNIQUE (name, team_name)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS drivers;');
}
