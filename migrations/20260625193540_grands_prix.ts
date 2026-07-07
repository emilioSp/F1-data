import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS grands_prix (
        id INTEGER PRIMARY KEY,
        number INTEGER NOT NULL,
        year INTEGER NOT NULL,
        official_name TEXT NOT NULL,
        name TEXT NOT NULL,
        circuit_name TEXT NOT NULL,
        country_code TEXT NOT NULL,
        location TEXT NOT NULL,
        sprint_qualifying_path TEXT,
        sprint_path TEXT,
        qualifying_path TEXT NOT NULL,
        race_path TEXT NOT NULL,
        UNIQUE (year, name)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS grands_prix;
  `);
}
