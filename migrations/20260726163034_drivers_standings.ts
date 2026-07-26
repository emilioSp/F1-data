import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS drivers_standings (
        driver_id UUID NOT NULL REFERENCES drivers(id),
        points INTEGER NOT NULL,
        session_id INTEGER REFERENCES sessions(id),
        PRIMARY KEY (driver_id, session_id)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS drivers_standings;');
}
