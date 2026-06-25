import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS qualifying_results (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        session_id INTEGER NOT NULL REFERENCES sessions(id),
        driver_id UUID NOT NULL REFERENCES drivers(id),
        position INTEGER NOT NULL,
        q1_time TEXT,
        q2_time TEXT,
        q3_time TEXT,
        knocked_out BOOLEAN NOT NULL,
        UNIQUE (session_id, driver_id)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS qualifying_results;');
}
