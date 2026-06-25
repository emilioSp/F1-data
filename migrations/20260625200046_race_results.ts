import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS race_results (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        session_id INTEGER NOT NULL REFERENCES sessions(id),
        driver_id UUID NOT NULL REFERENCES drivers(id),
        position INTEGER NOT NULL,
        best_laptime TEXT,
        gap_to_leader TEXT,
        gap_to_position_ahead TEXT,
        dnf BOOLEAN NOT NULL,
        number_of_pit_stops INTEGER NOT NULL,
        UNIQUE (session_id, driver_id)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS race_results;');
}
